import Axios from 'axios';
import React, { useState } from 'react';
import {
    Image, SafeAreaView,
    ScrollView, StyleSheet,
    TextInput, TouchableOpacity, View, Text, Alert
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, deletePet } from '../actions/auth';
import Loading from '../components/Loading';



const PetProfileScreen = ({ route, navigation }) => {
    const { petId } = route.params;

    const [data, setData] = useState({});
    const pets = useSelector(state => state.auth.pets);
    const [isLoading, setIsLoading] = useState(true);


    const dispatch = useDispatch();

    React.useEffect(() => {
        console.log('PET INFO', petId)
        const getPetInfo = async () => {
            Axios.get(`/pets/${petId}`)
                .then(res => {
                    console.log(res.data[0])
                    const pet = res.data[0];
                    setData({
                        name: pet.name,
                        gender: pet.gender,
                        breed: pet.breed,
                        age: pet.age,
                        weight: pet.weight,
                        avatar: pet.avatar,
                        introduction: pet.introduction,
                    })
                    setIsLoading(false)
                    console.log(isLoading)
                })
                .catch(error => console.log(error))
        }
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            setIsLoading(true)
            // Call any action
            getPetInfo()
        });


        return unsubscribe;
    }, [navigation, petId]);


    const _delete = () => {
        Axios.delete(`/pets/${petId}`)
            .then(res => {
                console.log(petId)
                dispatch(deletePet(petId));
                navigation.navigate('Profile')
            }).catch(e => console.error(e))
    }

    const onDeletePet = () => {
        Alert.alert(
            `Delete ${data.name}?`,
            `Are you sure to delete ${data.name}?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('User cancel delete!'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: _delete
                }
            ],
            { cancelable: false }
        )
    }

    const onEditPet = () => {
        navigation.navigate('EditPetScreen', { petInfo: data, petId: petId })
    }
    return (

        <SafeAreaView style={styles.container}>

            {isLoading ? <Loading></Loading> :
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleBar}>
                        <TouchableOpacity
                            onPress={onDeletePet}
                        >
                            <Entypo name='trash' size={30} color='#ff0000' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onEditPet}
                        >
                            <Feather name='edit' size={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: "center", paddingTop: 20 }}>
                        <View style={styles.profileImage}>
                            <Image source={data.avatar ? { uri: data.avatar } : require('../../assets/avatar.jpg')} style={styles.image} resizeMode="cover"></Image>
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{data.name}</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, styles.subText]}>Age</Text>
                            <Text style={[styles.text, { fontSize: 24 }]}>{data.age}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, styles.subText]}>Weight</Text>
                            <Text style={[styles.text, { fontSize: 24 }]}>{data.weight}</Text>
                        </View>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, styles.subText]}>Gender</Text>
                            <Text style={[styles.text, { fontSize: 24 }]}>{data.gender == 1 ? 'male' : 'female'}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, styles.subText]}>Breed</Text>
                            <Text style={[styles.text, { fontSize: 24 }]}>{data.breed}</Text>
                        </View>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, styles.subText]}>Introduction</Text>
                            <Text style={[styles.text, { fontSize: 24 }]}>{data.introduction}</Text>
                        </View>

                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: 200,
        width: 200
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        // marginTop: 94,
        marginHorizontal: 16,
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden",
        borderWidth: 4,
        borderColor: '#FF1',
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 0
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 20,
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 0,
        left: 10,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        marginLeft: 50,
        marginTop: 32,
        marginBottom: 6,
        paddingBottom: 10,
        fontSize: 16
    },
    recentItem: {
        flexDirection: "row",
        marginBottom: 10,
        flex: 1
    },
    activityIndicator: {
        // backgroundColor: "#CABFAB",
        padding: 4,
        // height: 12,
        // width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    },
    coverImg: {
        backgroundColor: '#ff0000',
        // height: '50%'
        height: 50,
        width: 200

    }
});
export default PetProfileScreen;