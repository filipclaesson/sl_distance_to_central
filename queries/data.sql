------- get non linked apartments locations ------

select distinct lon_short as lon,lat_short as lat from view_of_apt_sl where avg_time_to_central is null
---------- -----------------