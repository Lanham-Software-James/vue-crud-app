<template>
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
        v-model="add_name"
      ></el-input>

      <el-button 
        id="add-button"
        round  
        type="success" @click="createEmployee(add_name)"
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
      style="width: 75%;"
    >
      <el-table-column label="Date" prop="date"> </el-table-column>
      <el-table-column label="Name" prop="name"> </el-table-column>
      <el-table-column align="right">
       <template #default="scope">
         <el-popover
           placement="bottom"
           title="Edit Employee"
           width="200"
           trigger="click"
         >

           <template #reference>
             <el-button 
              round  
              type="success"
              @click="prepEdit(scope.row.name)"
               >Edit Employee</el-button
             >
           </template>

           <el-input
             placeholder="John Doe"
             v-model="edit_name"
           ></el-input>

           <el-button 
             id="edit-button" 
             round  
             type="warning"
             @click="editEmployee(scope.row.id, edit_name)"
             >Edit Employee</el-button
           >
           
           <el-button 
             id="delete-button" 
             round  
             type="danger"
             @click="deleteEmployee(scope.row.id)"
             >Delete Employee</el-button
           >
         </el-popover>
       </template>
     </el-table-column>
    </el-table>
  </div>
</template>

<script>

import db from "./firebaseInit.js";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const employees = collection(db, 'employees');

export default {
  name: 'App',
  data() {
    return {
      add_name: '',
      edit_name: '',
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
      this.add_employee_visible = false;
      
      addDoc(employees, {date: new Date(), name: name })
      .catch((error) => {
        console.error("Error writing document: %s", error);
      });
      
      this.add_name = '';
    },

    editEmployee(id, name) {
      const docRef = doc(db, 'employees', id);

      updateDoc(docRef, {name: name})
      .catch((error) => {
        console.error("Error writing document: %s", error);
      });
    },

    deleteEmployee(id) {
      const docRef = doc(db, 'employees', id);

      deleteDoc(docRef)
      .catch((error) => {
        console.error("Error deleting document: %s", error);
      });
    },

    prepEdit(name) {
      this.edit_name = name;
    }
  }
}
</script>

<style>
#delete-button, #add-button, #edit-button {
  margin-top: 10px;
}
</style>
