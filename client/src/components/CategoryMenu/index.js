import { useQuery } from "@apollo/react-hooks"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from "../../utils/actions"
import { idbPromise } from "../../utils/helpers"
import { QUERY_CATEGORIES } from "../../utils/queries"

function CategoryMenu() {
    const state = useSelector(state => {
        return state
    })
    const dispatch = useDispatch()

    const { categories } = state
    const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES)

    // Update the state with the categories upon page load or change
    useEffect(() => {
        // if categoryData exists or has changed from the response of useQuery, then run dispatch to update the state with the UPDATE_CATEGORIES action
        if (categoryData) {
            dispatch({
                type: UPDATE_CATEGORIES,
                categories: categoryData.categories,
            })
            // also store the category data in IndexedDB
            categoryData.categories.forEach(category => {
                idbPromise("categories", "put", category)
            })
        } else if (!loading) {
            // if the user is offline, load data from IndexedDB
            idbPromise("categories", "get").then(categories => {
                dispatch({
                    type: UPDATE_CATEGORIES,
                    categories: categories,
                })
            })
        }
    }, [categoryData, loading, dispatch])

    const handleClick = id => {
        dispatch({
            type: UPDATE_CURRENT_CATEGORY,
            currentCategory: id,
        })
    }

    return (
        <div>
            <h2>Choose a Category:</h2>
            {categories.map(item => (
                <button
                    key={item._id}
                    onClick={() => {
                        handleClick(item._id)
                    }}
                >
                    {item.name}
                </button>
            ))}
        </div>
    )
}

export default CategoryMenu
