import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ContactsTable from "../../components/ContactsTable/ContactsTable";



const ContactTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <ContactsTable></ContactsTable>
            </main>
            <Footer/>
        </>
    )
}
export default ContactTablePage;