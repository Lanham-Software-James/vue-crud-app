<template>
   <!-- eslint-disable -->
   <div>
    <el-popover
      placement="bottom"
      title="New Employee"
      width="200"
      trigger="click"
    >
    <template #reference>
      <el-button round  type="success"
        >Add New Employee</el-button
      >
    </template>
      <el-input
        placeholder="John Doe"
        v-model="name"
      ></el-input>

      <el-button round  type="success" @click="createEmployee(name)"
        >Add Employee</el-button
      >
    </el-popover>

    <el-table
      :data="
        employeesData.sort((a, b) => {
          if(a.date == b.date){
            return a.name.toLowerCase() <  b.name.toLowerCase() ? -1 : 1
          } else {
            return new Date(a.date) - new Date(b.date)
          }
        })
      "
      style="width: 100%;"
    >
      <el-table-column label="Date" prop="date"> </el-table-column>
      <el-table-column label="Name" prop="name"> </el-table-column>
      <!-- <el-table-column align="right">
        <template slot="header" :slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="Edit Employee"
            width="200"
            trigger="click"
          >
            <el-input
              placeholder="John Doe"
              v-model="scope.row.name"
              @blur="updateEmployee(scope.row.id, scope.row.name, date)"
            ></el-input>
            <el-button size="mini" slot="reference">Edit</el-button>
          </el-popover>
          <el-button
            size="mini"
            type="danger"
            @click="deleteEmployee(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import db from "./firebaseInit.js";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";

const employees = collection(db, 'employees');

export default {
  name: 'App',
  data() {
    return {
      name: '',
      employeesData: [],
      unsubscribe: ''
    }
  },
  mounted() {
    const q = query(employees);
    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.employeesData = []
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const date = new Date(doc.data().date.seconds * 1000).toLocaleDateString();
        const name = doc.data().name;
        const value = {id, date, name};

        this.employeesData.push(value);
      });
    });
  },
  unmounted() {
    this.unsubscribe();
  },
  methods: {
    createEmployee(name) {
      
      addDoc(employees, {date: new Date(), name: name })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: %s", error);
      });
    }
  }


}
</script>

<style>

</style>
