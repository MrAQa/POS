import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
// import { } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useReactToPrint } from 'react-to-print';
import NavigationIcon from '@mui/icons-material/Navigation';
import {
  Paper,
  Typography,
  Table,
  Container, Stack, Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import './app.css';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AllData from './AllData';

import useResponsive from '../hooks/useResponsive';

import ComponentToPrint from './ComponentToPrint';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

// const StyledSection = styled('div')(({ theme }) => ({
//   width: '100%',
//   maxWidth: 480,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   boxShadow: theme.customShadows.card,
//   backgroundColor: theme.palette.background.default,
// }));

// const StyledContent = styled('div')(({ theme }) => ({
//   maxWidth: 480,
//   margin: 'auto',
//   minHeight: '100vh',
//   display: 'flex',
//   justifyContent: 'center',
//   flexDirection: 'column',
//   padding: theme.spacing(12, 0),
// }));

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const [SelectedTitle, setSelectedTitle] = useState('Food');
  const [ChangeValue, setChangeValue] = useState(0);
  const [SelectProducts, setSelectProducts] = useState([]);
  const [name, setName] = React.useState([
    {
      title: 'Pizza',
    },
    {
      title: "Pasta",
    },
    {
      title: "Drinks",
    },
    {
      title: "Fries",
    },
    {
      title: "Shakes",
    },
    {
      title: 'Deals',
    },
    {
      title: 'Desserts',
    },
    {
      title: 'Dips',
    },
  
  ]);

  useEffect(() => {
    setSelectProducts(SelectProducts);
  }, [SelectProducts]);

  const addItem = (Item) => {
    // Check if the item already exists in the array
    const existingItemIndex = SelectProducts.findIndex(product => product.title === Item.title);
    
    // If the item exists, increment its quantity
    if (existingItemIndex !== -1) {
        const updatedProducts = [...SelectProducts];
        updatedProducts[existingItemIndex] = {
            ...updatedProducts[existingItemIndex],
            quantity: updatedProducts[existingItemIndex].quantity + 1
        };
        setSelectProducts(updatedProducts);
        console.log(updatedProducts);
    } else {
        // If the item does not exist, add it to the array
        const newArray = [...SelectProducts, Item];
        setSelectProducts(newArray);
        console.log(newArray);
    }
};


  const addCustom = (Item) => {
    const newArray = [
      ...SelectProducts,
      {
        title: '',
        price: '0',
        type: 'Pizza',
        quantity: 1,
      },
    ];
    console.log(newArray);
    setSelectProducts(newArray);
  };
  const removeItemByIndex = (index) => {
    const newArray = [...SelectProducts];

    if (index >= 0 && index < newArray.length) {
      newArray.splice(index, 1);

      setSelectProducts(newArray);
    } else {
      console.error('Invalid index.');
    }
  };

  const calculateTotal = () => {
    if (!SelectProducts || SelectProducts.length === 0) {
      return 0;
    }

    const totalPrice = SelectProducts.reduce((accumulator, product) => {
      return accumulator + Number(product.price) * Number(product.quantity);
    }, 0);

    return totalPrice.toFixed(2);
  };

  const calculateTotalPrice = (product, index, name) => {
    const newPrice = Number(product.quantity) * Number(product.price);
    return newPrice.toString();
  };

  const defaultValue = (e, index) => {
    const obj = [...SelectProducts]; // Use spread operator to create a shallow copy of SelectProducts
    obj[index].price = e.target.value;
    console.log(obj);
    setSelectProducts(obj);
  };

  const quantityChange = (e, index) => {
    console.log(e.target.value);
    if (e.target.value) {
      const newQuantity = parseInt(e.target.value, 10);

      const updatedProducts = [...SelectProducts];
      updatedProducts[index].quantity = newQuantity;
      setSelectProducts(updatedProducts);
      console.log(updatedProducts)
    } else {
      const newQuantity = 0;

      const updatedProducts = [...SelectProducts];
      updatedProducts[index].quantity = newQuantity;
      setSelectProducts(updatedProducts);
    }
  };

  const priceCHange = (e, index) => {
    setChangeValue(e.target.value);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handle = (e) => {
    handlePrint();
  };

  const addBIllwithoutPrint = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Karachi',
    };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    console.log(formattedTime);
    if (calculateTotal() && SelectProducts) {
      fetch(`http://51.20.84.249/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: calculateTotal(),
          Items: SelectProducts,
          date: formattedTime.toString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSelectProducts([]);
          setChangeValue(0);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const addBIll = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Karachi',
    };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    console.log(formattedTime);
    if (calculateTotal() && SelectProducts) {
      handle();

      fetch(`http://51.20.84.249/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: calculateTotal(),
          Items: SelectProducts,
          date: formattedTime.toString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSelectProducts([]);
          setChangeValue(0);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const resetAll = () => {
    setSelectProducts([]);
    setChangeValue(0);
  };

  return (
    <>
    <StyledRoot>
  <Container maxWidth="lg" sx={{ py: 2 }}>
    <Grid container spacing={2} sx={{ minHeight: '100vh' }}>
      {/* Categories Column */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '50vh', overflowY: 'auto' }}>
          <Stack spacing={1}>
            {name.map((item) => (
              <Button
                key={item.title}
                variant="contained"
                color={SelectedTitle === item.title ? 'primary' : 'secondary'}
                onClick={() => setSelectedTitle(item.title)}
                fullWidth
                startIcon={<NavigationIcon />}
                sx={{ py: 1.5, textTransform: 'none' }}
              >
                {item.title}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* Products Column */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ height: '50vh', overflowY: 'auto', p: 2 }}>
          <Grid container spacing={1}>
            {AllData?.filter(item => item.type === SelectedTitle).map((item) => (
              <Grid item xs={6} sm={4} key={item.id}>
                <Button
                  variant="outlined"
                  onClick={() => addItem(item)}
                  fullWidth
                  sx={{ 
                    py: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* Cart Column */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '50vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6">Cart</Typography>
            <Button onClick={resetAll} color="error" size="small">
              Reset All
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            {SelectProducts.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                Cart is empty
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell> ''</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SelectProducts.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => quantityChange(e, index)}
                          size="small"
                          sx={{ width: 70 }}
                          inputProps={{ min: 1 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={calculateTotalPrice(item, index, 'price')}
                          onChange={(e) => defaultValue(e, index)}
                          size="small"
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => removeItemByIndex(index)} size="small">
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Totals Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Change"
                type="number"
                fullWidth
                variant="outlined"
                onChange={priceCHange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 1.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography variant="subtitle2">Total</Typography>
                <Typography variant="h6">Rs.{calculateTotal()}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 1.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography variant="subtitle2">Return</Typography>
                <Typography variant="h6">
                  Rs.{ChangeValue > 0 ? ChangeValue - calculateTotal() : 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addBIll}
                  fullWidth
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={addBIllwithoutPrint}
                  fullWidth
                >
                  Save Without Print
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </Container>
</StyledRoot>
    </>
  );
}
