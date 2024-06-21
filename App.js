import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import theme from "./colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (textInput) => {
    setText(textInput);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCheck = async (id) => {
    todos[id].checked = !todos[id].checked;
    const newTodos = { ...todos, [id]: todos[id] };
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newTodos = {
      ...todos,
      [Date.now()]: { text, work: working, checked: false },
    };
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const saveTodos = async (toSave) => {
    try {
      const saveTodos = JSON.stringify(toSave);
      await AsyncStorage.setItem("@todos", saveTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = (id) => {
    Alert.alert("Delete item", "Are you sure to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[id];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  const loadTodos = async () => {
    try {
      const todosInStorage = await AsyncStorage.getItem("@todos");
      if (todosInStorage) {
        setTodos(JSON.parse(todosInStorage));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? "#009fa9" : theme.grey,
            }}
          >
            WORK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.grey : "#ee8e1d",
            }}
          >
            TRAVEL
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={
          working ? "What is your primary goal?" : "Where is your next stop?"
        }
        placeholderTextColor="#6E6E6E"
        value={text}
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        returnKeyType="Done"
      />
      <ScrollView>
        {Object.keys(todos).map((key, index) =>
          working === todos[key].work ? (
            <View
              key={index}
              style={{
                ...styles.todos,
                backgroundColor: working ? "#009fa9" : "#ee8e1d",
              }}
            >
              <Checkbox
                onValueChange={() => handleCheck(key)}
                value={todos[key].checked}
                color={theme.check}
              ></Checkbox>
              <Text
                style={{
                  ...styles.todoText,
                  textDecorationLine: todos[key].checked
                    ? "line-through"
                    : null,
                }}
              >
                {todos[key].text}
              </Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto
                  name="trash"
                  size={16}
                  color={theme.trash}
                  style={styles.trash}
                />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "800",
    color: "white",
  },
  input: {
    backgroundColor: "#c9c9c9",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 14,
    marginVertical: 30,
    fontWeight: "500",
  },
  todos: {
    backgroundColor: "#1A1A1A",
    marginBottom: 15,
    padding: 20,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 25,
    width: "80%",
  },
  trash: {},
});
