import { createContext, useState } from "react";
import { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";
 
// Creating a Realm App Instance
const app = new App(APP_ID);
 
// Creating a user context to manage and access all the user related functions
// across different components and pages.
export const UserContext = createContext();

/*
The UserProvider component returns whatever is passed as children inside the UserContext.Provider. The children prop in React is a special prop that is used to pass components or elements from parent components to child components.

When you use the UserProvider component in your application, it might look something like this:

<UserProvider>
  <YourComponent />
</UserProvider>

Here, <YourComponent /> is passed as children to UserProvider. This children prop is then rendered inside UserContext.Provider:
return <UserContext.Provider value={{ user, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, logOutUser }}>
   {children}
 </UserContext.Provider>;

*/
export const UserProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 
 // Function to log in user into our App Service app using their email & password
 const emailPasswordLogin = async (email, password) => {
   const credentials = Credentials.emailPassword(email, password);
   const authenticatedUser = await app.logIn(credentials);
   setUser(authenticatedUser);
   return authenticatedUser;
 };
 
 // Function to sign up user into our App Service app using their email & password
 const emailPasswordSignup = async (email, password) => {
   try {
     await app.emailPasswordAuth.registerUser(email, password);
     // Since we are automatically confirming our users, we are going to log in
     // the user using the same credentials once the signup is complete.
     return emailPasswordLogin(email, password);
   } catch (error) {
     throw error;
   }
 };
 
 // Function to fetch the user (if the user is already logged in) from local storage
 const fetchUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.refreshCustomData();
     // Now, if we have a user, we are setting it to our user context
     // so that we can use it in our app across different components.
     setUser(app.currentUser);
     return app.currentUser;
   } catch (error) {
     throw error;
   }
 }
 
 // Function to logout user from our App Services app
 const logOutUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.logOut();
     // Setting the user to null once loggedOut.
     setUser(null);
     return true;
   } catch (error) {
     throw error
   }
 }
 
/*
In React, a context is created to share values between different components without explicitly passing the values through each level of the tree, i.e., without using props. In the context object, the Provider component allows consuming components to subscribe to context changes.

The .Provider is a part of the Context API in React. When you create a context using React.createContext(), you get a pair of components: Provider and Consumer (or you can use the useContext hook for function components).

The Provider component is used higher in the tree and accepts a value prop. The value passed in the value prop will be accessible by all descendants of this Provider.

<UserContext.Provider value=... is setting up the UserContext.Provider with a value that contains all the state and functions that you want to make available to other components. Any component that is a child of this UserContext.Provider (i.e., nested inside it, directly or indirectly) will be able to access user, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, and logOutUser.

The {children} inside the UserContext.Provider means it will render whatever child components are passed into it. This is where you'd typically place the rest of your application, so that any component within can access the context.

By wrapping the entire app with this context provider, you're ensuring that all components in your app's component tree can access the data and functions provided in the context. This can make it easier to manage state in a large application.

*/

 return <UserContext.Provider value={{ user, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, logOutUser }}>
   {children}
 </UserContext.Provider>;
}