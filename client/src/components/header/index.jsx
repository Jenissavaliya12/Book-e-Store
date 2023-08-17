import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { headerStyle } from "./style";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import ListItem from "@material-ui/core/ListItem";

import {  Button } from "@material-ui/core";
import Shared from "../../utils/shared";
import { useAuthContext } from "../../context/auth";
import { RoutePaths } from "../../utils/enum";
import { toast } from "react-toastify";

import bookService from "../../service/book.service";
import { BiCartAlt } from "react-icons/bi";
import { useCartContext } from "../../context/cart";

const Header = () => {
  const classes = headerStyle();
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  // const [open, setOpen] = useState(false);
  // const open = false;
  const [query, setquery] = useState("");
  const [bookList, setbookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);

  const navigate = useNavigate();

  // for  mobile menu
  const openMenu = () => {
    document.body.classList.toggle("open-menu");
  };

  const items = useMemo(() => {
    return Shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);

  const logOut = () => {
    authContext.signOut();
    cartContext.emptyCart();
  };

  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    
    setbookList(res);
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate(RoutePaths.Login);
      toast.error("Please login before adding books to cart");
    } else {
      Shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in cart");
          cartContext.updateCart();
        }
      });
    }
  };

  return (
    <div className={classes.headerWrapper}>
      <AppBar className="site-header" id="header" position="static">
        <div className="bottom-header">
          <div className="container">
            <div className="header-wrapper">
              <div className="logo-wrapper">
                {authContext.user.id  ? (<Link to="/" className="site-logo" title="logo">
                  <p className="logo-header">BookStore</p>
                </Link>) : (<Link className="site-logo" title="logo">
                  <p className="logo-header">BookStore</p>
                </Link>)}
              </div>
              <div className="nav-wrapper">
                <div className="top-right-bar">
                  <List className="top-nav-bar">
                    {!authContext.user.id && (
                      <>
                        <ListItem>
                          <NavLink to={RoutePaths.Login} title="Login">
                            Login
                          </NavLink>
                        </ListItem>
                        <ListItem>
                          <Link to={RoutePaths.Register} title="Register">
                            Register
                          </Link>
                        </ListItem>
                      </>
                    )}
                    {items.map((item, index) => (
                      <ListItem key={index}>
                        <Link to={item.route} title={item.name}>
                          {item.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>

                  {authContext.user.id && (
                    <List className="right cart-country-wrap">
                      <ListItem className="cart-link">
                        <Link to="/cart" title="Cart">
                          <BiCartAlt />
                         
                          Cart{" "}
                          <span class="position-absolute top-0 start-95 translate-middle p-2 ms-2 bg-danger border border-light rounded-circle">
                          {cartContext.cartData.length}
                          </span>
                        </Link>
                      </ListItem>
                      <ListItem className="hamburger" onClick={openMenu}>
                        <span></span>
                      </ListItem>
                      <Button onClick={() => logOut()} variant="outlined">
                        Log out
                      </Button>
                    </List>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="search-overlay"
          onClick={() => {
            setOpenSearchResult(false);
            document.body.classList.remove("search-results-open");
          }}
        ></div>
        <div className="header-search-wrapper">
          <div className="container">
            <div className="header-search-outer">
              <div className="header-search-inner">
                <div className="text-wrapper">
                  {/* <TextField
                    id="text"
                    name="text"
                    placeholder="Search..."
                    variant="outlined"
                    value={query}
                    onChange={(e) => setquery(e.target.value)}
                  /> */}
                  <div className="search-container">
                    <input
                      type="text"
                      id="text"
                      placeholder="Search..."
                      className="search-field"
                      value={query}
                      onChange={(e) => setquery(e.target.value)}
                      name="text"
                    />
                    <button
                      className="search-button btn"
                      type="submit"
                      onClick={search}
                    >
                      Search
                    </button>
                  </div>
                  {openSearchResult && (
                    <>
                      <div className="product-listing">
                        {bookList?.length === 0 && (
                          <p className="no-product">No product found</p>
                        )}

                        {/* <p className="loading">Loading....</p> */}
                        <List className="related-product-list">
                          {bookList?.length > 0 &&
                            bookList.map((item, i) => {
                              return (
                                <ListItem key={i}>
                                  <div className="inner-block">
                                    <div className="left-col">
                                      <span className="title">{item.name}</span>
                                      <p>{item.description}</p>
                                    </div>
                                    <div className="right-col">
                                      <span className="price">
                                        {item.price}
                                      </span>
                                      <Link onClick={() => addToCart(item)}>
                                        Add to cart
                                      </Link>
                                    </div>
                                  </div>
                                </ListItem>
                              );
                            })}
                        </List>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppBar>
    </div>
  );
};

export default Header;
