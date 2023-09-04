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
        v-model="add_name"
      ></el-input>

      <el-button round  type="success" @click="createEmployee(add_name)"
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
              @click="setEditName(scope.row.name)"
               >Edit Employee</el-button
             >
           </template>

           <el-input
             placeholder="John Doe"
             v-model="edit_name"
           ></el-input>

           <el-button 
             class="margin-button" 
             round  
             type="warning"
             @click="editEmployee(scope.row.id, edit_name)"
             >Edit Employee</el-button
           >
           
           <el-button 
             class="margin-button" 
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
/* eslint-disable */
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
      
      addDoc(employees, {date: new Date(), name: name })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: %s", error);
      });
    },

    editEmployee(id, name) {
      const docRef = doc(db, 'employees', id);

      updateDoc(docRef, {name: name});
    },

    deleteEmployee(id) {
      const docRef = doc(db, 'employees', id);

      deleteDoc(docRef);
    },

    setEditName(name) {
      this.edit_name = name;
    }
  }


}
</script>

<style>

</style>
