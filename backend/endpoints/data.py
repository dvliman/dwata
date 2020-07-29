import sqlalchemy
from sqlalchemy import MetaData, select, func
from json.decoder import JSONDecodeError

from utils.response import RapidJSONResponse, web_error
from utils.query_builder import QueryBuilder


async def data_post(request):
    """
    This method fetches actual data from one or more sources, given a specification for columns, joins, limits,
    etc. This method is a POST method because the query specification can become large.
    We use JSON (in the POST payload) to specify the query.
    """
    default_per_page = 25

    try:
        query_specification = await request.json()
    except JSONDecodeError:
        return web_error(
            error_code="request.json_decode_error",
            message="We could not handle that request, perhaps something is wrong with the server."
        )
    qb = QueryBuilder(query_specification)
    columns, rows, count, query_sql = await qb.results()

    return RapidJSONResponse(
        dict(
            columns=columns,
            rows=rows,
            count=count,
            limit=query_specification.get("limit", default_per_page),
            offset=query_specification.get("offset", 0),
            query_sql=query_sql,
        )
    )
