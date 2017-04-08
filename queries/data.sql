------- get non linked apartments locations ------

select distinct lon_short as lon,lat_short as lat from view_of_apt_sl v where v.avg_time_to_central is null
and not exists(select 1 from exclude_sl e where v.lon_short = e.lon_short and v.lat_short = e.lat_short)
---------- -----------------