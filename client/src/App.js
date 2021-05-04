import React 			from 'react';
import Homescreen 		from './components/Homescreen';
import CreateAccount	from './components/CreateAccount';
import Login			from './components/Login';
import Maps				from './components/Maps';
import Regions			from './components/Regions';
import UpdateAccount	from './components/UpdateAccount';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }

	return(
		<BrowserRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/home"} } />
				<Route 
					path="/home" 
					name="home" 
					render={() => 
						<Homescreen fetchUser={refetch} user={user} />
					} 
				/>
				<Route 
					path="/signup" 
					name="signup" 
					render={() => 
						<CreateAccount fetchUser={refetch} user={user} />
					} 
				/>
				<Route 
					path="/login" 
					name="login" 
					render={() => 
						<Login fetchUser={refetch} user={user} />
					} 
				/>
				<Route 
					exact path="/maps" 
					name="maps" 
					render={() => 
						<Maps fetchUser={refetch} user={user} />
					} 
				/>
				<Route
					path="/maps/" 
					name="map regions" 
					component={(props) => <Regions {...props} fetchUser={refetch} user={user}/>}
				/>
				<Route 
					path="/update-account" 
					name="update-account" 
					render={() => 
						<UpdateAccount  fetchUser={refetch} user={user} />
					} 
				/>
				<Route/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;