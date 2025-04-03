// Simple debug script to check if we can load the dependencies
try {
  console.log('Loading dotenv...');
  require('dotenv').config();
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Found' : 'Not found');
  
  console.log('Loading express...');
  const express = require('express');
  
  console.log('Loading @google/generative-ai...');
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  console.log('Loading fs...');
  const fs = require('fs').promises;
  
  console.log('Loading cors...');
  const cors = require('cors');
  
  console.log('Loading path...');
  const path = require('path');
  
  console.log('All dependencies loaded successfully!');
} catch (error) {
  console.error('Error loading dependencies:', error);
}
