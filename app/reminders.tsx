import tsximport { ArrowLeft, Bell, BellOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

const DEFAULT_REMINDERS = [
       { id: '1', title: 'Morning water', desc: 'Drink a glass of water after waking up', time: '8:00 AM', emoji: '💧' },
]