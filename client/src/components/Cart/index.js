import React, { useEffect } from "react"
import Auth from "../../utils/auth"
import CartItem from "../CartItem"
import "./style.css"

import { useLazyQuery } from "@apollo/react-hooks"
import { loadStripe } from "@stripe/stripe-js"
import { ADD_MULTIPLE_TO_CART, TOGGLE_CART } from "../../utils/actions"
import { idbPromise } from "../../utils/helpers"
import { QUERY_CHECKOUT } from "../../utils/queries"

import { useDispatch, useSelector } from "react-redux"

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx")

const Cart = () => {
    const state = useSelector(state => {
        return state
    })
    const dispatch = useDispatch()

    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT)

    useEffect(() => {
        // async function to get data from IndexedDB
        async function getCart() {
            const cart = await idbPromise("cart", "get")
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] })
        }
        // check global state for any cart products, and if not, use function to retrieve data from the IndexedDB store
        if (!state.cart.length) {
            getCart()
        }
    }, [state.cart.length, dispatch])

    useEffect(() => {
        if (data) {
            stripePromise.then(res => {
                res.redirectToCheckout({ sessionId: data.checkout.session })
            })
        }
    }, [data])

    function toggleCart() {
        dispatch({ type: TOGGLE_CART })
    }

    if (!state.cartOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                {/* <span role="img" aria-label="cart">
                    🛒
                </span> */}
            </div>
        )
    }

    function calculateTotal() {
        let sum = 0
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity
        })
        return sum.toFixed(2)
    }

    function submitCheckout() {
        const productIds = []

        getCheckout({
            variables: { products: productIds },
        })

        state.cart.forEach(item => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id)
            }
        })
    }

    return (
        <div className="cart">
            <div className="close" onClick={toggleCart}>
                [close]
            </div>
            <h2>Shopping Cart</h2>
            {state.cart.length ? (
                <div>
                    {state.cart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className="flex-row space-between">
                        <strong>Total: ${calculateTotal()}</strong>
                        {Auth.loggedIn() ? (
                            <button onClick={submitCheckout}>Checkout</button>
                        ) : (
                            <span>(log in to check out)</span>
                        )}
                    </div>
                </div>
            ) : (
                <h3>Your cart is empty...that is not Purrfect!</h3>
            )}
        </div>
    )
}

export default Cart
