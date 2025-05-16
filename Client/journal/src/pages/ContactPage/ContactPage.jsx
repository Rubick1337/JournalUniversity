import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PersonsTable from "../../components/PersonTable/PersonTable";



const ContactTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <PersonsTable></PersonsTable>
            </main>
            <Footer/>
        </>
    )
}
export default ContactTablePage;