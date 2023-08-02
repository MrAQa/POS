import { Helmet } from 'react-helmet-async';
import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useReactToPrint } from 'react-to-print';
import NavigationIcon from '@mui/icons-material/Navigation';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import Paper from '@mui/material/Paper';
import axios from 'axios';

import './app.css'
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AllData from './AllData'

import useResponsive from '../hooks/useResponsive';


import Logo from '../components/logo';
import Iconify from '../components/iconify';
import { LoginForm } from '../sections/auth/login';
import ComponentToPrint from './ComponentToPrint';


const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));


export default function LoginPage() {
    const mdUp = useResponsive('up', 'md');
    const [SelectedTitle, setSelectedTitle] = useState('Food')
    const [ChangeValue, setChangeValue] = useState(0)
    const [SelectProducts, setSelectProducts] = useState([])
    const [name, setName] = React.useState([{
        title: 'Food'
    }, {
        title: 'Chai'
    }, {
        title: 'Juice'
    },
    {
        title: 'Others',
    }
    ]);


    const addItem = (Item) => {
        // Check if the item already exists in the array

        // If the item doesn't exist, add it to the array with quantity 1
        const newArray = [...SelectProducts, Item];
        console.log(newArray);
        setSelectProducts(newArray);
    }


    const removeItemByIndex = (index) => {
        // Make a copy of the original array using spread operator
        const newArray = [...SelectProducts];

        // Check if the index is within the array bounds
        if (index >= 0 && index < newArray.length) {
            // Use splice() method to remove the item at the specified index
            newArray.splice(index, 1);

            // Update the state with the modified array
            setSelectProducts(newArray);
        } else {
            console.error("Invalid index.");
        }
    };

    const calculateTotal = () => {
        if (!SelectProducts || SelectProducts.length === 0) {
            return 0; // Return 0 if SelectProducts is empty or not defined
        }

        const totalPrice = SelectProducts.reduce((accumulator, product) => {
            return accumulator + Number(product.price) * Number(product.quantity);
        }, 0);

        return totalPrice.toFixed(2); // Return the total price with two decimal places
    };

    const calculateTotalPrice = (product, index, name) => {

        const newPrice = Number(product.quantity) * Number(product.price);
        return newPrice.toString();
    }

    const quantityChange = (e, index) => {
        console.log(e.target.value)
        if (e.target.value) {

            const newQuantity = parseInt(e.target.value, 10);

            const updatedProducts = [...SelectProducts];
            updatedProducts[index].quantity = newQuantity;
            setSelectProducts(updatedProducts);
        }
        else {
            const newQuantity = 0

            const updatedProducts = [...SelectProducts];
            updatedProducts[index].quantity = newQuantity;
            setSelectProducts(updatedProducts);
        }

    };

    const priceCHange = (e, index) => {
        setChangeValue(e.target.value)
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handle = (e) => {
        // e.preventDefault();

        handlePrint()
    }

    const addBIllwithoutPrint = (e) => {
        e.preventDefault()
        const currentDate = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit',
            // second: '2-digit',
            timeZone: 'Asia/Karachi', // PKT time zone
        };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
        console.log(formattedTime)
        if (calculateTotal() && SelectProducts) {

            fetch(`http://localhost:8200/api/posts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "totalAmount": calculateTotal(),
                    "Items": SelectProducts,
                    "date": formattedTime.toString(),
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    setSelectProducts([])
                    setChangeValue(0)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const addBIll = (e) => {
        e.preventDefault()
        const currentDate = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit',
            // second: '2-digit',
            timeZone: 'Asia/Karachi', // PKT time zone
        };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
        console.log(formattedTime)
        if (calculateTotal() && SelectProducts) {
            handle()

            fetch(`http://localhost:8200/api/posts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "totalAmount": calculateTotal(),
                    "Items": SelectProducts,
                    "date": formattedTime.toString(),
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    setSelectProducts([])
                    setChangeValue(0)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const resetAll = () => {
        setSelectProducts([])
        setChangeValue(0)
    }

    return (
        <>
            <StyledRoot>
                <Container maxWidth="lg">
                    <Box sx={{ width: '100%' }}>
                        <Grid container rowSpacing={1} spacing={1} style={{ height: '100vh', backgroundColor: 'lightgreen' }}>
                            <Grid item spacing={2} rowSpacing={1} xs={8} style={{ backgroundColor: 'lightgreen', height: '50vh' }}>
                                <div style={{ height: '316px', overflowY: 'auto', background: 'white' }}>
                                    <Item>
                                        {AllData && AllData.map((item) => {
                                            return (
                                                item.type === SelectedTitle ? (
                                                    <Button variant="contained" color="success" onClick={() => addItem(item)} style={{ marginBottom: '8px', padding: '10px', marginLeft: '8px', fontSize: '16px' }}>
                                                        {item.title}
                                                    </Button>) : null
                                            )
                                        })}
                                    </Item>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div style={{ height: '300px', overflowY: 'auto' }}>
                                        <a href='#' onClick={resetAll}>Reset All</a>

                                        <table className="table table-sm table-dark">
                                            <thead>
                                                <tr>
                                                    <th className="col">#</th>
                                                    <th className="col">Title</th>
                                                    <th className="col">Quantity</th>
                                                    <th className="col">Price</th>
                                                    <th className="col">clear</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {SelectProducts && SelectProducts?.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <th className="col">{index + 1}</th>
                                                            <td>{item.title}</td>
                                                            <td><input type='number' name='quantity' style={{ width: '40px', textAlign: 'center' }} defaultValue={item.quantity} onChange={(e) => quantityChange(e, index)} /></td>
                                                            <td>
                                                                {calculateTotalPrice(item, index, 'price')}

                                                                {/* <input type='text' name="price" style={{ width: '80px', textAlign: 'center' }} defaultValue={calculateTotalPrice(item, index, 'price')} maxLength={3} max={3} /> */}
                                                            </td>
                                                            <td style={{ cursor: 'pointer' }} ><Button style={{ color: 'white' }} onClick={() => removeItemByIndex(index)}>X</Button></td>

                                                        </tr>
                                                    )
                                                })}



                                            </tbody>
                                        </table>
                                        {SelectProducts.length < 1 && <div style={{ textAlign: 'center' }}> <h6>Cart is empty</h6></div>}


                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={4} maxWidth={200} style={{ backgroundColor: 'lightgreen' }}>
                                <Item>
                                    <Stack direction="column" spacing={2} mb={2}>
                                        {name && name.map((item => {
                                            return (
                                                <Fab variant="extended" onClick={() => setSelectedTitle(item.title)}>
                                                    <NavigationIcon sx={{ mr: 1 }} />
                                                    {item.title}
                                                </Fab>
                                            )
                                        }))}

                                        {
                                        }
                                    </Stack>

                                </Item>
                            </Grid>
                            <Grid item xs={8} style={{ backgroundColor: 'lightgreen' }}>
                                <Item>

                                    <Box
                                        component="form"
                                        sx={{
                                            '& > :not(style)': { m: 1, width: '20ch' },
                                        }}
                                        noValidate
                                        className='totalBox'
                                        autoComplete="off"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: 'auto' }}>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                <div className='lableTotal'> Change</div>
                                                <input type='number' className='change' onChange={priceCHange} />

                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                <div className='lableTotal'> Total</div>
                                                <div className='totalButton'>
                                                    Rs.{calculateTotal()}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: 'auto' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                <div className='lableTotal'> Return</div>

                                                <div className='totalReturn'>

                                                    Rs.{ChangeValue > 0 ? ChangeValue - calculateTotal() : 0}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }} className='mt-2'>
                                                <div style={{ display: 'none' }}>
                                                    <ComponentToPrint calculateTotal={calculateTotal()} SelectProducts={SelectProducts} ref={componentRef} />
                                                </div>
                                                <button onClick={(e) => addBIllwithoutPrint(e)} className='btn btn-primary mb-2' >WithOut Print</button>
                                                {/* <div className='lableTotal'> Return</div> */}
                                                <button className='print' type='button' onClick={(e) => addBIll(e)}>
                                                    Print
                                                </button>
                                            </div>
                                        </div>

                                    </Box>

                                </Item>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </StyledRoot>
        </>
    );
}
