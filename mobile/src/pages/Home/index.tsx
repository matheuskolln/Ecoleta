import React ,{ useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface FormatPickerSelect {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<FormatPickerSelect[]>([]);
  const [cities, setCities] = useState<FormatPickerSelect[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  function handleNavigateToPoints() {
    if (selectedUf === '0' || selectedCity === '0')
      Alert.alert('Ooops...', 'Precisamos que selecione a uf e a cidade.');
    else
      navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  }

  useEffect(() => {
    async function loadUfs() {
      const res = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        const ufInitials = res.data.map(uf => {
          return {
            label: uf.sigla,
            value: uf.sigla
          };
        });
      setUfs(ufInitials);
    }
    loadUfs();
  }, []);
  
  useEffect(() => {
    async function loadCities() {
      if (selectedUf === '0') return;

      const response = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`);

      const cityNames = response.data.map(city => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });

      setCities(cityNames);
    }
    loadCities();
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView style={{ flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width:274, height: 368 }}
        
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>
        
        <View style={styles.footer}>
        <RNPickerSelect
            placeholder={{
              label: 'Selecione o estado',
              value: '0',
            }}
            style={{...pickerSelectStyles }}
            onValueChange={(value) => {
              setSelectedUf(String(value));
              setSelectedCity('0');
            }}
            items={ufs}
        />
        <RNPickerSelect
            placeholder={{
              label: 'Selecione a cidade',
              value: '0',
            }}
            style={{...pickerSelectStyles }}
            onValueChange={(value) => {
              setSelectedCity(String(value));
            }}
            items={cities}
        />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>

  )
};

const pickerSelectStyles = StyleSheet.create({
  viewContainer: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  inputAndroid: {
    color: '#322153'
  },

  inputIOS: {
    color: '#322153'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#0fc25f',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#dbdbec',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;