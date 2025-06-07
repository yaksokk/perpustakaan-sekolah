import Users from './Admin/users/users'
import Dashboard from './Shared/dashboard/dashboard'
import BorrowList from './Shared/borrow-list/borrowList'
import ReturnedList from './Shared/returned-list/ReturnedList'
import SelectedBooks from './Shared/selected-books/selectedBooks'
import { default as KoleksiBukuOperator } from './Shared/koleksi-buku/koleksiBuku';
import Peminjaman from './User/peminjaman/peminjaman'
import Pengembalian from './Operator/pengembalian/pengembalian'
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