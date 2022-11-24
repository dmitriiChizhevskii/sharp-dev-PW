import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { UserInterface, TransactionInterface } from '../../../services/MoneyService';
import { AuthDataInterface } from '../../../services/AuthService';

const customColumnStyle = { maxWidth: '30px', backgroundColor: '' };


export default function TransactionTable({
  transactionsState,
  userInfo,
  usersState
}: {
  transactionsState: TransactionInterface[],
  userInfo: AuthDataInterface,
  usersState: UserInterface[]
}) {
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
          transactionsState.map((row:TransactionInterface) => {
            const DirIcon = row.senderId === userInfo.sub ? ArrowCircleRightIcon : ArrowCircleLeftIcon;
            const DirColor = row.senderId === userInfo.sub ? 'primary' : 'secondary';
            let user;

            if (row.senderId === userInfo.sub) {
              user = usersState.find((u:any) => u.id === row.receiverId);
            } else {
              user = usersState.find((u:any) => u.id === row.senderId);
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