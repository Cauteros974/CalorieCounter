import React from "react";
import { useUserStore } from "@/store/useUserStore";
import {useForm, Controller} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const profileSchema = () => {
    fullName: 
}