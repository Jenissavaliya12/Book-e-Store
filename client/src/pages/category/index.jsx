import React from "react";
import { defaultFilter, RecordsPerPage } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import categoryService from "./../../service/category.service";
import ConfirmationDialog from "./../../components/ConfirmationDialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { productStyle } from "../User/style";
import { toast } from "react-toastify";
import shared from "../../utils/shared";

const Category = () => {
  const classes = productStyle();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilter);
  const [selectedId, setSelectedId] = useState(0);
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };
  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success(shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error(shared.messages.DELETE_FAIL));
  };

  const columns = [{ id: "name", label: "Category Name", minWidth: 100 }];

  return (
    <div className={classes.productWrapper}>
      <div className="container">
        <h5 className="Book-page text-center mb-5 mt-5">Category Page</h5>
        <div className="search-head-container">
          <div className="search-book-container">
            <input
              type="text"
              id="text"
              placeholder="Search..."
              className="search-add-field"
              onChange={(e) => {
                setFilters({
                  ...filters,
                  keyword: e.target.value,
                  pageIndex: 1,
                });
              }}
              name="text"
            />
            <button
              className=" add-btn"
              type="submit"
              onClick={() => navigate("/add-category")}
            >
              Add
            </button>
          </div>
        </div>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryRecords?.items?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>

                  <TableCell align="right">
                    <button
                      className=" edit-btn"
                      type="button"
                      onClick={() => {
                        navigate(`/edit-category/${row.id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn "
                      type="button"
                      onClick={() => {
                        setOpen(true);
                        setSelectedId(row.id ?? 0);
                      }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {!categoryRecords.items.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                    <p> No Books</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={categoryRecords.totalItems}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        <ConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this book?"
        />
      </div>
    </div>
  );
};

export default Category;
