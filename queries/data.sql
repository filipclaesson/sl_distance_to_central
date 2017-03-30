------- get non linked apartments locations ------
with base as (  
select substring(a.lon::text from 1 for 6) as lon 
, substring(a.lat::text from 1 for 6) as lat 
, g.avg_time_to_central::numeric as avg_time_to_central 
, address 
, sold_price 
, sqm  
, sold_date 
from apartments a  
left join geo_data_sl g on (g.lon = round(a.lon::numeric,3)::text and g.lat = round(a.lat::numeric,3)::text)  
)  
select lon, lat from base where avg_time_to_central is null 

-- one row
with base as (  select substring(a.lon::text from 1 for 6) as lon , substring(a.lat::text from 1 for 6) as lat , g.avg_time_to_central::numeric as avg_time_to_central , address , sold_price , sqm  , sold_date from apartments a  left join geo_data_sl g on (g.lon = round(a.lon::numeric,3)::text and g.lat = round(a.lat::numeric,3)::text)  )  select lon, lat from base where avg_time_to_central is null 


---------- -----------------