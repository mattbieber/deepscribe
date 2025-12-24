curl -X GET "https://clinicaltrials.gov/api/v2/studies?query.cond=%28head+OR+neck%29+AND+pain&filter.advanced=AREA%5BMinimumAge%5DRANGE%5BMIN%2C+16+years%5D+AND+AREA%5BMaximumAge%5DRANGE%5B16+years%2C+MAX%5D" \
 -H "accept: application/json"
