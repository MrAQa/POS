import React from 'react'

import moment from 'moment';

import logo from '../logo.png'

const now = moment();
// const newDateTime = now.add(2, 'days');
const formattedDateTime = now.format('DD-MM-YYYY h:mm A');
const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <>
            <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
                <h2 style={{ fontWeight: '700' }}>The Hunger Bites</h2>
                {/* <img className='mainHeading' alt='logo' width={100} height={100} src={logo} /> */}
                {' '}   {' '} <small style={{wordBreak:'break-word',paddingLeft:'10px',paddingRight:'10px',display: 'flex', alignItems: 'center',justifyContent:'center',textAlign:'center'}}>Main market opposite nadra office main zarrar shaheed road jorry pull lahore</small> {' '} {' '}
                <span>#03298550193</span>

                --------------------------------------------
                {/* <span>Order # </span>
                -------------------------------------------- */}

                <table>
                    <thead>
                        <tr>
                            <th style={{ fontWeight: '600' }}>Title</th>
                            <th style={{ textAlign: 'center'}}>Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.SelectProducts && props.SelectProducts.map((item) => {
                            return (
                                <tr>
                                    <td style={{ wordBreak:'break-word',width:'70%'}}>{item.title}</td>
                                    <td style={{ textAlign: 'center',wordBreak:'break-word'}}>{item.quantity}</td>
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