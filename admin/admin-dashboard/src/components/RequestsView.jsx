import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApproveButton, DeclineButton } from "./ConfirmationPopup";

const API_URL = import.meta.env.VITE_API_URL;

const RequestsView = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredImg, setSelectedCredImg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchPendingAccounts = async () => {
      try {
        const response = await axios.get(`${API_URL}/business/pending`);
        setPendingAccounts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending accounts:", error);
        setLoading(false);
      }
    };

    fetchPendingAccounts();
  }, []);

  const handleShowCredImg = (credImg) => {
    setSelectedCredImg(credImg);
  };

  const handleCloseDialog = () => {
    setSelectedCredImg(null);
  };

  const handleApprove = async (idbusiness) => {
    try {
      await axios.put(`${API_URL}/admin/approve/${idbusiness}`);
      setPendingAccounts(
        pendingAccounts.filter((account) => account.idbusiness !== idbusiness)
      );
      toast.success("Business has been accepted");
    } catch (error) {
      console.error("Error approving business:", error);
      toast.error("Error approving business");
    }
  };

  const handleDecline = async (idbusiness) => {
    try {
      await axios.delete(`${API_URL}/admin/decline/${idbusiness}`);
      setPendingAccounts(
        pendingAccounts.filter((account) => account.idbusiness !== idbusiness)
      );
      toast.info("Business has been declined");
    } catch (error) {
      console.error("Error declining business:", error);
      toast.error("Error declining business");
    }
  };

  const filteredAccounts = pendingAccounts.filter((account) => {
    const matchesSearchTerm = account.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? account.category === selectedCategory
      : true;
    return matchesSearchTerm && matchesCategory;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4, width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Pending Business Accounts
      </Typography>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <TextField
          label="Search by Username"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: "40%" }}
        />
        <TextField
          select
          label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          variant="outlined"
          sx={{ width: "200px" }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {[
            "Restaurant",
            "Coffee Shop",
            "Nature",
            "Art",
            "Camping",
            "Workout",
            "Cycling",
          ].map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {filteredAccounts.length === 0 && (
            <Typography variant="body1">No pending accounts found.</Typography>
          )}
          <TableContainer
            component={Paper}
            sx={{ width: "100%", overflowX: "auto" }}
          >
            <Table sx={{ minWidth: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>BOID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Cred Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((account) => (
                    <TableRow key={account.idbusiness}>
                      <TableCell>{account.idbusiness}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.BOid}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.businessName}</TableCell>
                      <TableCell>{account.category}</TableCell>
                      <TableCell>
                        <img
                          src={account.credImg}
                          alt="Credential"
                          style={{ width: "50px", cursor: "pointer" }}
                          onClick={() => handleShowCredImg(account.credImg)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <ApproveButton onConfirm={() => handleApprove(account.idbusiness)} />
                          <DeclineButton onConfirm={() => handleDecline(account.idbusiness)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAccounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </>
      )}
      <Dialog open={Boolean(selectedCredImg)} onClose={handleCloseDialog}>
        <DialogTitle>Credential Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCredImg && (
              <img
                src={selectedCredImg}
                alt="Credential"
                style={{ width: "100%" }}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default RequestsView;