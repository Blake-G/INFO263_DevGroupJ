## INFO263 Assignment (Group J)

Come join the [group Slack](https://join.slack.com/t/info263-group-j/shared_invite/MjMxNzgxMTUyMzA4LTE1MDM2NjE1MTEtZmJmYjJiODFlNQ) so we can discuss things easily



21/09/17
Have basic functionality of the map and marker system working
'index.php'
- Included a drop down list of routes to track
- Included a button that performs the same things as when selecting from the drop down list
- Updates the map automatically every 30s
- Updates the map on new selection of drop down menu
- Updates the map on click of the button
-- Both updates use the value from the drop down menu


'scripts/map.js'
- Has several support functions for adding/deleting map markers
- Has the main 'updateMap'function that is called from index.php after an event occurs (like the timer automatically refreshing or a selection from the drop down list)
-- Adds markers based on the result from 'new_request.php'
-- Adjusts the map bounds if the call was not from the auto refresh timer.


new file 'scripts/add_routes_to_dropdown.js'
- Adds all the route codes to the drop down menu


new file 'new_request.php'
- Queries the database for trip_ids that have a given route_short_name (the route code (eg 120))

-- I can see that the final apiCall is unnecessary, but I haven't got around to removing it as it just works right now.
- Sends an apiCall using the function from 'requets.php' and gets the entire list of active trips.
- Then compares the list of active tripids with the list of tripids from the database and then sends another apiCall with the matching tripids.
- "prints" the results which will be retrieved from index.php and processed in 'updateMap'.


There isn't much protection against spamming requests via the button or drop down list, and probably minimal error checking.

I've tried to comment as much as possible to make my code readable.
Although there is still plenty of commented out debugging code that I've left in for my own purposes.

!!! Because I've been working on this from home, there may be differences between some variables around accessing the database or perhaps specific file paths that I've overlooked.

-Blake