//To set up a server side project,first run the command npm init -y
then run the command npm install.and then install the dependencies what ever you want for the project
if you are coding in ts,then it run the command npm install -g typescript and then it should have a ts.config file
for this run the command npx tsc --init and if you are connecting to a database,install the required depencies
******* when routes are in separate files *** we need to use the express.Router() method
we can't directly access the body of the request,we need tp parse the data