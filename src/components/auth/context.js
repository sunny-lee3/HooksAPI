import React from 'react';

import cookies from 'react-cookies';
import jwt from 'jsonwebtoken';

export const LoginContext = React.createContext();


const testUsers = [
    {
        password:'password',
        name:'Administrator',
        role:'admin',
        capabilities:['create','read','update','delete']
    },
    {
        password: 'password',
        name: 'Editor',
        role: 'editor',
        capabilities: ['read', 'update']
    },
    {
        password: 'password',
        name: 'Writer',
        role: 'writer',
        capabilities: ['create', 'read']
    }
]


class LoginProvider extends React.Component {

    constructor() {
        super();
        this.state = {
            login: this.login,
            logout: this.logout,
            isAuthenticated: false,
            isAuthorized: this.isAuthorized,
            user: {capabilities:[]},
        };
    }
    
    login = (username, password) => {
        // search our testUser and return a valid user.
        let validUser = {};
        let token = null;
        testUsers.forEach(user => {
            if (user.name === username && user.password === password) {
                validUser = user
            }
        });
            if (validUser) {
                token = jwt.sign(validUser, 'secretstring');
            }
        cookies.save('token', token);
        this.setState({ isAuthenticated: true, user: validUser });
    }
        
    logout = () => {
        this.setState({
            isAuthenticated: false, 
            isAuthorized: null, 
            user: {}
        });
    };
        
    isAuthorized = (capability) => {
        if(this.state.user) {
            return this.state.user.capabilities?.includes(capability);
        }
    }
    
        
    
    // validateToken = (token) => {
    //     try {
    //         let user = jwt.verify(token, 'secret');
    //         this.setState({loggedIn: true, token: token, user: user});
    //     }
    //     catch (e) {
    //         this.setState({loggedIn: false, can: null, user:{}});
    //         console.log('Token Validation Error', e);
    //     }
        
    // };
        
    //     setLoginState = (loggedIn, token, user) => {
    //         cookies.save('auth', token);
    //         this.setState({ token: token, loggedIn: loggedIn, user: user });
    //         console.log('includes', this.state.user);
    // };

    // componentDidMount() {
    //     // const qs = new URLSearchParams(window.location.search);
    //     const cookieToken = cookies.load('token');
    //     // const token = qs.get('token') || cookieToken || null;
    //     // this.validateToken(token);
    // }

    render() {
        return (
        <LoginContext.Provider value={this.state}>
            {this.props.children}
        </LoginContext.Provider>
        );
    }
}

export default LoginProvider;