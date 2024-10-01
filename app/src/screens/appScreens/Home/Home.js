import React from "react";
import { SafeAreaView, StyleSheet, FlatList, Text, View, Image, ScrollView } from "react-native";
import Navbar from "../../../components/Navbar";
import Fonts from "../../../utils/Fonts";

const DEFAULT_AVATAR = "https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/71201981163c1c1753fc67cb4c3944db";

// Mock de dados para os times, artilheiros e assistentes
const mockNbaStandings = [
  { id: 1, team: { id: 1, name: "Atlanta Hawks", logo: "https://upload.wikimedia.org/wikipedia/en/8/83/Atlanta_Hawks_logo.svg" }, points: 0 },
  { id: 2, team: { id: 2, name: "Boston Celtics", logo: "https://upload.wikimedia.org/wikipedia/en/8/8e/Boston_Celtics.svg" }, points: 0 },
  { id: 3, team: { id: 3, name: "Brooklyn Nets", logo: "https://upload.wikimedia.org/wikipedia/en/4/44/Brooklyn_Nets_logo.svg" }, points: 0 },
  { id: 4, team: { id: 4, name: "Charlotte Hornets", logo: "https://upload.wikimedia.org/wikipedia/en/5/5a/Charlotte_Hornets_logo.svg" }, points: 0 },
  { id: 5, team: { id: 5, name: "Chicago Bulls", logo: "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg" }, points: 0 },
  { id: 6, team: { id: 6, name: "Cleveland Cavaliers", logo: "https://upload.wikimedia.org/wikipedia/en/2/24/Cleveland_Cavaliers_logo.svg" }, points: 0 },
  { id: 7, team: { id: 7, name: "Dallas Mavericks", logo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Dallas_Mavericks_logo.svg" }, points: 0 },
  { id: 8, team: { id: 8, name: "Denver Nuggets", logo: "https://upload.wikimedia.org/wikipedia/en/4/44/Denver_Nuggets_logo.svg" }, points: 0 },
  { id: 9, team: { id: 9, name: "Detroit Pistons", logo: "https://upload.wikimedia.org/wikipedia/en/3/3f/Detroit_Pistons_logo.svg" }, points: 0 },
  { id: 10, team: { id: 10, name: "Golden State Warriors", logo: "https://upload.wikimedia.org/wikipedia/en/b/bc/Golden_State_Warriors_logo.svg" }, points: 0 },
  { id: 11, team: { id: 11, name: "Houston Rockets", logo: "https://upload.wikimedia.org/wikipedia/en/2/2f/Houston_Rockets_logo.svg" }, points: 0 },
  { id: 12, team: { id: 12, name: "Indiana Pacers", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/Indiana_Pacers_logo.svg" }, points: 0 },
  { id: 13, team: { id: 13, name: "Los Angeles Clippers", logo: "https://upload.wikimedia.org/wikipedia/en/3/3a/Los_Angeles_Clippers_logo.svg" }, points: 0 },
  { id: 14, team: { id: 14, name: "Los Angeles Lakers", logo: "https://upload.wikimedia.org/wikipedia/en/3/3f/Los_Angeles_Lakers_logo.svg" }, points: 0 },
  { id: 15, team: { id: 15, name: "Memphis Grizzlies", logo: "https://upload.wikimedia.org/wikipedia/en/a/a0/Memphis_Grizzlies_logo.svg" }, points: 0 },
  { id: 16, team: { id: 16, name: "Miami Heat", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/Miami_Heat_logo.svg" }, points: 0 },
  { id: 17, team: { id: 17, name: "Milwaukee Bucks", logo: "https://upload.wikimedia.org/wikipedia/en/1/1e/Milwaukee_Bucks_logo.svg" }, points: 0 },
  { id: 18, team: { id: 18, name: "New Orleans Pelicans", logo: "https://upload.wikimedia.org/wikipedia/en/5/5e/New_Orleans_Pelicans_logo.svg" }, points: 0 },
  { id: 19, team: { id: 19, name: "New York Knicks", logo: "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg" }, points: 0 },
  { id: 20, team: { id: 20, name: "Oklahoma City Thunder", logo: "https://upload.wikimedia.org/wikipedia/en/e/e8/Oklahoma_City_Thunder_logo.svg" }, points: 0 },
  { id: 21, team: { id: 21, name: "Orlando Magic", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/Orlando_Magic_logo.svg" }, points: 0 },
  { id: 22, team: { id: 22, name: "Philadelphia 76ers", logo: "https://upload.wikimedia.org/wikipedia/en/5/50/Philadelphia_76ers_logo.svg" }, points: 0 },
  { id: 23, team: { id: 23, name: "Phoenix Suns", logo: "https://upload.wikimedia.org/wikipedia/en/5/5f/Phoenix_Suns_logo.svg" }, points: 0 },
  { id: 24, team: { id: 24, name: "Portland Trail Blazers", logo: "https://upload.wikimedia.org/wikipedia/en/2/20/Portland_Trail_Blazers_logo.svg" }, points: 0 },
  { id: 25, team: { id: 25, name: "Sacramento Kings", logo: "https://upload.wikimedia.org/wikipedia/en/9/99/Sacramento_Kings_logo.svg" }, points: 0 },
  { id: 26, team: { id: 26, name: "San Antonio Spurs", logo: "https://upload.wikimedia.org/wikipedia/en/6/6c/San_Antonio_Spurs_logo.svg" }, points: 0 },
  { id: 27, team: { id: 27, name: "Toronto Raptors", logo: "https://upload.wikimedia.org/wikipedia/en/a/a9/Toronto_Raptors_logo.svg" }, points: 0 },
  { id: 28, team: { id: 28, name: "Utah Jazz", logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/Utah_Jazz_logo.svg" }, points: 0 },
  { id: 29, team: { id: 29, name: "Washington Wizards", logo: "https://upload.wikimedia.org/wikipedia/en/1/1e/Washington_Wizards_logo.svg" }, points: 0 }
];

const mockTopScorers = [
  { id: 1, name: "LeBron James", points: 30, team: "Los Angeles Lakers", profileImage: "https://upload.wikimedia.org/wikipedia/en/4/4a/LeBron_James_%282019%29.jpg" },
  { id: 2, name: "Kevin Durant", points: 28, team: "Phoenix Suns", profileImage: "https://upload.wikimedia.org/wikipedia/en/5/54/Kevin_Durant_2018.jpg" },
  { id: 3, name: "Giannis Antetokounmpo", points: 26, team: "Milwaukee Bucks", profileImage: "https://upload.wikimedia.org/wikipedia/en/a/a0/Giannis_Antetokounmpo.jpg" },
];

const mockTopAssistants = [
  { id: 1, name: "James Harden", assists: 10, team: "Philadelphia 76ers", profileImage: "https://upload.wikimedia.org/wikipedia/en/2/26/James_Harden_2019.jpg" },
  { id: 2, name: "Chris Paul", assists: 9, team: "Phoenix Suns", profileImage: "https://upload.wikimedia.org/wikipedia/en/6/65/Chris_Paul.jpg" },
  { id: 3, name: "Trae Young", assists: 8, team: "Atlanta Hawks", profileImage: "https://upload.wikimedia.org/wikipedia/en/b/b0/Trae_Young_2020.jpg" },
];

// Componente principal da tela Home
const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Classificação NBA</Text>
        </View>
        
        <FlatList
          data={mockNbaStandings}
          renderItem={({ item }) => (
            <View style={styles.teamContainer}>
              <Image source={{ uri: item.team.logo }} style={styles.teamLogo} />
              <Text style={styles.teamName}>{item.team.name}</Text>
              <Text style={styles.teamPoints}>{`Pts: ${item.points}`}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Top Artilheiros</Text>
        </View>
        <FlatList
          data={mockTopScorers}
          renderItem={({ item }) => (
            <View style={styles.playerContainer}>
              <Image source={{ uri: item.profileImage }} style={styles.playerImage} />
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerPoints}>{`Pts: ${item.points}`}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Top Assistentes</Text>
        </View>
        <FlatList
          data={mockTopAssistants}
          renderItem={({ item }) => (
            <View style={styles.playerContainer}>
              <Image source={{ uri: item.profileImage }} style={styles.playerImage} />
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerAssists}>{`Ast: ${item.assists}`}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#54514F",
  },
  titleContainer: {
    padding: 16,
    backgroundColor: "#3D3D3D",
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: Fonts.bold,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    backgroundColor: '"#A69F9C"',
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  teamName: {
    flex: 1,
    fontSize: 18,
  },
  teamPoints: {
    fontSize: 18,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  playerName: {
    flex: 1,
    fontSize: 18,
  },
  playerPoints: {
    fontSize: 18,
  },
  playerAssists: {
    fontSize: 18,
  },
});

export default Home;
