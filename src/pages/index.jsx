import Dashboard from './dashboard/dashboard'
import Users from './Admin/users/users'
import BorrowList from './Operator/borrow-list/borrowList'
import ReturnedList from './Operator/returned-list/ReturnedList'
import SelectedBooks from './Operator/selected-books/selectedBooks'
import { default as KoleksiBukuOperator } from './Operator/koleksi-buku/koleksiBuku';
import Peminjaman from './User/peminjaman/peminjaman'
import Pengembalian from './User/pengembalian/pengembalian'
import { default as KoleksiBukuUser } from './User/koleksi-buku/koleksiBuku';
export {
    Dashboard,
    KoleksiBukuOperator,
    KoleksiBukuUser,
    Peminjaman,
    Pengembalian,
    SelectedBooks,
    BorrowList,
    ReturnedList,
    Users
}