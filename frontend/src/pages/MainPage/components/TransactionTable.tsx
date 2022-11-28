import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { useAppSelector } from "../../../hooks/redux";

const customColumnStyle = { maxWidth: '30px', backgroundColor: '' };


export default function TransactionTable() {
  const transactions = useAppSelector(state => state.wallet.transactions);
  const { sub } = useAppSelector(state => state.auth.user);
  const partners = useAppSelector(state => state.wallet.partners);

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={customColumnStyle}>Direction</TableCell>
            <TableCell>Date/Time of the transaction</TableCell>
            <TableCell>Correspondent Name</TableCell>
            <TableCell>Transaction amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          transactions.map(row => {
            const DirIcon = row.senderId === sub ? ArrowCircleRightIcon : ArrowCircleLeftIcon;
            const DirColor = row.senderId === sub ? 'primary' : 'secondary';
            let user;

            if (row.senderId === sub) {
              user = partners.find((u:any) => u.id === row.receiverId);
            } else {
              user = partners.find((u:any) => u.id === row.senderId);
            }

            return (
              <TableRow

                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell style={customColumnStyle} component="th" scope="row">
                  <DirIcon color={DirColor} />
                </TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {
                    user ? user.email : ' - '
                  }
                </TableCell>
                <TableCell>{row.amountMajor}</TableCell>
              </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer> 
  );
} 