import React from "react";
import _ from 'lodash'


export default class Stars extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            'stars': Math.floor((props.rating + 0.09) / 0.2)
        }
    }

    render() {
        const {stars} = this.state
        if (stars < 1) {
            return <span></span>
        }
        return <span className="stars">
            {_.times(stars, (i) => <span key={i} className="glyphicon glyphicon-star" aria-hidden="true"></span>)}
        </span>
    }
}
