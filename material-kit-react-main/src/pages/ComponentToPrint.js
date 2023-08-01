import React from 'react'

import moment from 'moment';

import logo from '../logo.png'

const now = moment();
const formattedDateTime = now.format('DD-MM-YYYY h:mm A');
const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <>
            <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
              <h2 style={{fontWeight:'700'}}>Docter Hotel</h2>
                {/* <img className='mainHeading' alt='logo' width={100} height={100} src={logo} /> */}
                ---------------------- ----------------------
                <span>{formattedDateTime}</span>
                ---------------------- ----------------------
                <table>
                    <thead>
                        <tr>
                            <th style={{fontWeight:'600'}}>Title</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.SelectProducts && props.SelectProducts.map((item) => {
                            return (
                                <tr>
                                    <td>{item.title}</td>
                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                    <td>{item.price}</td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                ---------------------- ----------------------
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ marginRight: '60px' }}>
                        Total {' '}{' '}{' '}{' '}{' '}{' '}{' '}{' '}{' '}
                    </span>
                    <span>
                        {props.calculateTotal}
                    </span>
                </div>
                ---------------------- ----------------------

                <span className='mt-1'><b>Thank  you</b></span>
                {/* <span>{formattedDateTime}</span> */}
            </div>
            {/* <div ref={ref}>My cool content here!</div> */}
        </>
    );
});
export default ComponentToPrint