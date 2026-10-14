import httpx
from typing import Dict, Any, Optional

WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

async def get_wikidata_details(wikidata_id: str) -> Optional[Dict[str, Any]]:
    """
    Enriches an OSM place with Wikidata knowledge graph details:
    - Multilingual names (Sinhala, Tamil, English)
    - Commons image URL
    - Wikipedia article summary
    """
    query = f"""
    SELECT ?itemLabel ?itemDescription ?image ?siLabel ?taLabel WHERE {{
      BIND(wd:{wikidata_id} AS ?item)
      OPTIONAL {{ ?item wdt:P18 ?image. }}
      OPTIONAL {{
        ?item rdfs:label ?siLabel.
        FILTER(LANG(?siLabel) = "si")
      }}
      OPTIONAL {{
        ?item rdfs:label ?taLabel.
        FILTER(LANG(?taLabel) = "ta")
      }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en,si,ta". }}
    }}
    LIMIT 1
    """
    headers = {
        "User-Agent": "CeylonWanderBot/1.0 (ceylonwander@example.com)"
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.get(
                WIKIDATA_SPARQL_URL, 
                params={"query": query, "format": "json"}, 
                headers=headers
            )
            if resp.status_code == 200:
                results = resp.json().get("results", {}).get("bindings", [])
                if results:
                    row = results[0]
                    return {
                        "name_en": row.get("itemLabel", {}).get("value"),
                        "name_si": row.get("siLabel", {}).get("value"),
                        "name_ta": row.get("taLabel", {}).get("value"),
                        "image_url": row.get("image", {}).get("value"),
                        "description": row.get("itemDescription", {}).get("value")
                    }
        except Exception as e:
            print(f"Wikidata enrichment error for {wikidata_id}: {e}")
    return None
