import { useMutation } from "@apollo/react-hooks"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Form, Grid, Header, Message, Segment } from "semantic-ui-react"
import Auth from "../utils/auth"
import { ADD_USER } from "../utils/mutations"

function Signup(props) {
    const [formState, setFormState] = useState({ email: "", password: "" })
    const [addUser] = useMutation(ADD_USER)

    const handleFormSubmit = async event => {
        event.preventDefault()
        const mutationResponse = await addUser({
            variables: {
                email: formState.email,
                password: formState.password,
                firstName: formState.firstName,
                lastName: formState.lastName,
            },
        })
        const token = mutationResponse.data.addUser.token
        Auth.login(token)
    }

    const handleChange = event => {
        const { name, value } = event.target
        setFormState({
            ...formState,
            [name]: value,
        })
    }

    return (
        <Grid textAlign="center" style={{ height: "70vh" }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" color="black" textAlign="center">
                    Join the Fam!
                </Header>
                <Form size="large" onSubmit={handleFormSubmit}>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            placeholder="First Name"
                            name="firstName"
                            type="firstName"
                            id="firstName"
                            onChange={handleChange}
                        />
                        <Form.Input
                            fluid
                            placeholder="Last Name"
                            name="lastName"
                            type="lastName"
                            id="lastName"
                            onChange={handleChange}
                        />
                        <Form.Input
                            fluid
                            placeholder="E-mail address"
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                        />
                        <Form.Input
                            fluid
                            placeholder="Password"
                            type="password"
                            id="pwd"
                            name="password"
                            onChange={handleChange}
                        />
                        <button className="ui secondary button" type="submit">
                            Sign Up
                        </button>
                    </Segment>
                </Form>
                <Message>
                    Already have an account? <Link to="/login">Login</Link>
                </Message>
            </Grid.Column>
        </Grid>
    )
    // return (
    //     <div className="container my-1">
    //         <Link to="/login">← Go to Login</Link>

    //         <h2>Signup</h2>
    //         <form onSubmit={handleFormSubmit}>
    //             <div className="flex-row space-between my-2">
    //                 <label htmlFor="firstName">First Name:</label>
    //                 <input
    //                     placeholder="First"
    //                     name="firstName"
    //                     type="firstName"
    //                     id="firstName"
    //                     onChange={handleChange}
    //                 />
    //             </div>
    //             <div className="flex-row space-between my-2">
    //                 <label htmlFor="lastName">Last Name:</label>
    //                 <input placeholder="Last" name="lastName" type="lastName" id="lastName" onChange={handleChange} />
    //             </div>
    //             <div className="flex-row space-between my-2">
    //                 <label htmlFor="email">Email:</label>
    //                 <input
    //                     placeholder="youremail@test.com"
    //                     name="email"
    //                     type="email"
    //                     id="email"
    //                     onChange={handleChange}
    //                 />
    //             </div>
    //             <div className="flex-row space-between my-2">
    //                 <label htmlFor="pwd">Password:</label>
    //                 <input placeholder="******" name="password" type="password" id="pwd" onChange={handleChange} />
    //             </div>
    //             <div className="flex-row flex-end">
    //                 <button type="submit">Continue</button>
    //             </div>
    //         </form>
    //     </div>
    // )
}

export default Signup
