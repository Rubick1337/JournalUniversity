import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import UserProfile from "../../components/Profile/Profile";


const ProfilePage = props => {
    return (
        <>
            <Header/>
            <main>
                <UserProfile/>
            </main>
            <Footer/>
        </>
    )
}
export default ProfilePage;