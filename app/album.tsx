import { useUserStore } from "@/store/useUserStore";
import { ArrowLeft } from "lucide-react-native";
import { Dimensions, TouchableOpacity, View } from "react-native";

const COL = 2;
const GAP = 12;
const CARD_W = (Dimensions.get('window').width - 40 - GAP) / COL;

export default function AlbumScreen() {
    const {photo} = useUserStore;

    return(
        <View style = {styles.container}>
            <View style = {styles.header}>
                <TouchableOpacity>
                    <ArrowLeft color="#1A1A1A" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    )
}