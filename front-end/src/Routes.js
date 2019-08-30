import UserList from 'path/to/user/list';
import AddUserForm from 'path/....';

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={UserList}/>
        <Route path="addUser" component={AddUserForm}/>
    </Route>
);

export default routes;
