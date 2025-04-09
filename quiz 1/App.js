import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Image, ImageBackground } from "react-native";

export default function WeatherApp() {
  const [weather] = useState({
    city: "Islamabad, Pakistan",
    temperature: "20°C",
    condition: "Partly Cloudy",
  });

  // Determine emoji based on weather condition
  const getWeatherEmoji = (condition) => {
    if (condition.toLowerCase().includes("sunny")) return "☀️";
    if (condition.toLowerCase().includes("cloudy")) return "⛅";
    if (condition.toLowerCase().includes("rain")) return "🌧️";
    if (condition.toLowerCase().includes("storm")) return "⛈️";
    if (condition.toLowerCase().includes("snow")) return "❄️";
    return "🌍";
  };

  // Get background image based on weather condition
  const getBackgroundImage = (condition) => {
    if (condition.toLowerCase().includes("sunny"))
      return "https://cdn.pixabay.com/photo/2015/09/08/18/16/sunset-930386_1280.jpg";
    if (condition.toLowerCase().includes("cloudy"))
      return "https://cdn.pixabay.com/photo/2019/10/17/16/34/landscape-4556697_1280.jpg";
    if (condition.toLowerCase().includes("rain"))
      return "https://cdn.pixabay.com/photo/2015/09/21/15/47/rain-951493_1280.jpg";
    if (condition.toLowerCase().includes("storm"))
      return "https://cdn.pixabay.com/photo/2015/11/07/11/54/lightning-1031576_1280.jpg";
    if (condition.toLowerCase().includes("snow"))
      return "https://cdn.pixabay.com/photo/2016/03/27/18/36/iceland-1282584_1280.jpg";
    return "https://cdn.pixabay.com/photo/2017/08/30/07/54/sky-2692312_1280.jpg"; // Default sky image
  };

  // Cloud animation
  const cloud1X = new Animated.Value(-200);
  const cloud2X = new Animated.Value(200);
  const floatingY = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloud1X, {
        toValue: 400,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloud2X, {
        toValue: -400,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();

    // Floating animation for background
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingY, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatingY, { toValue: 10, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <ImageBackground source={{ uri: getBackgroundImage(weather.condition) }} style={styles.background}>
      <View style={styles.overlay} />

      {/* Floating Cloud Animations */}
      <Animated.View style={[styles.cloud, { top: 50, left: cloud1X }]}>
        <Image
          source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/934/847/large_2x/collection-of-cartoon-clouds-cloud-sticker-clipart-generated-by-ai-photo.jpg" }}
          style={styles.cloudImage}
        />
      </Animated.View>

      <Animated.View style={[styles.cloud, { bottom: 80, right: cloud2X }]}>
        <Image
          source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/934/847/large_2x/collection-of-cartoon-clouds-cloud-sticker-clipart-generated-by-ai-photo.jpg" }}
          style={styles.cloudImage}
        />
      </Animated.View>

      {/* Weather Card with Floating Effect */}
      <Animated.View style={[styles.card, { transform: [{ translateY: floatingY }] }]}>
        <Text style={styles.city}>{weather.city}</Text>
        <Text style={styles.temperature}>{weather.temperature}</Text>
        <Text style={styles.condition}>
          {weather.condition} <Text style={styles.emoji}>{getWeatherEmoji(weather.condition)}</Text>
        </Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 255, 0.2)", // Slight overlay for better visibility
  },
  card: {
    width: 270,
    padding: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  city: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  temperature: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#007aff",
    marginVertical: 5,
  },
  condition: {
    fontSize: 20,
    color: "#666",
  },
  emoji: {
    fontSize: 30, // Increased emoji size
  },
  cloud: {
    position: "absolute",
  },
  cloudImage: {
    width: 120, // Increased cloud size
    height: 80,
    opacity: 0.8,
  },
});

