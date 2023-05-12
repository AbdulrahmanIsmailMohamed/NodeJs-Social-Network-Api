import UserInterface from "../interfaces/user.Interface";

class SenitizeData {
    userLogin = (user: UserInterface) => (
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }
    );
    userRegister = (user: UserInterface) => (
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            number: user.number,
            address: user.address,
        }
    );
    friends = (user: UserInterface) => (
        {
            _id: user._id,
            friends: user.friends
        }
    )
}

export default SenitizeData;