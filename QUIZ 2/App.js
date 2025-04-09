import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";

const API_URL = "https://api.disneyapi.dev/character";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      const json = await response.json();

      if (!json.data || !Array.isArray(json.data)) {
        throw new Error("Invalid API response format");
      }

      const top20 = json.data.slice(0, 20);
      setData(top20);
      setFilteredData(top20);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedCharacter(item)}
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.imageOverlay}
          >
            <Text style={styles.title}>{item.name}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#10002B", "#240046", "#3C096C"]} style={styles.container}>
      <Text style={styles.header}>🎥 Favourite Disney Movie Characters ✨</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search characters..."
        placeholderTextColor="#ccc"
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noData}>❌ No Characters Found!</Text>
      )}

      <Modal
        isVisible={!!selectedCharacter}
        onBackdropPress={() => setSelectedCharacter(null)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
      >
        {selectedCharacter && (
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedCharacter.imageUrl }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedCharacter.name}</Text>
            <Text style={styles.modalText}>
              🎬 Movies:{" "}
              <Text style={styles.movieText}>
                {selectedCharacter.films?.join(", ") || "Unknown"}
              </Text>
            </Text>
          </View>
        )}
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FFD700",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 18,
    margin: 12,
    borderRadius: 20,
    alignItems: "center",
    width: 160,
    shadowColor: "#FFD700",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    textTransform: "capitalize",
  },
  noData: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalImage: { width: 160, height: 160, borderRadius: 15, marginBottom: 15 },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  modalText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    fontStyle: "italic",
  },
  movieText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b5876",
  },
});

export default App;
