import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchImages, resetImages} from '../redux/imagesSlice';
import {Auth} from '../services';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = () => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const {images, loading, page, error, query, hasMore} = useSelector(
    state => state.images,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false); // Loading state for search

  const userId = auth().currentUser ? auth().currentUser.uid : null;

  // Fetch default images on mount
  useEffect(() => {
    dispatch(fetchImages({query: 'nature', page: 1}));

    // Fetch search history from Firestore
    const fetchHistory = async () => {
      if (userId) {
        const historySnapshot = await firestore()
          .collection('users')
          .doc(userId)
          .collection('searchHistory')
          .orderBy('timestamp', 'desc')
          .limit(10)
          .get();

        const history = historySnapshot.docs.map(doc => doc.data().query);
        setSearchHistory(history);
      }
    };

    fetchHistory();
  }, [dispatch, userId]);

  // Handle search and save query to Firestore
  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // Prevent empty searches
    setSearchLoading(true); // Set loading to true
    dispatch(resetImages()); // Clear previous images
    dispatch(fetchImages({query: searchQuery, page: 1})); // Fetch with new query

    // Save the search query to Firestore
    if (userId) {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('searchHistory')
        .add({
          query: searchQuery,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      // Update local history state
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]); // Keep last 10 searches
    }

    setSearchLoading(false); // Reset loading state
  };

  // Clear search history from Firestore and local state
  const clearSearchHistory = async () => {
    if (userId) {
      const historyRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('searchHistory');

      const historySnapshot = await historyRef.get();

      const batch = firestore().batch();
      historySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Clear the local search history state
      setSearchHistory([]);
    }
  };

  // Load more images on scroll
  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchImages({query, page: page + 1})); // Load next page if available
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme === 'dark' ? '#110E18' : '#FCFCFC',
      }}>
      <View
        style={{
          padding: 15,
          backgroundColor: theme === 'dark' ? '#110E18' : '#FCFCFC',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 18,
            textTransform: 'capitalize',
            color: theme === 'dark' ? '#F7F7F7' : '#363636',
          }}>
          {auth().currentUser ? auth().currentUser.displayName : 'Home'}
        </Text>
        <TouchableOpacity onPress={() => Auth.signOut()}>
          <Text
            style={{
              fontSize: 18,
              textTransform: 'capitalize',
              color: theme === 'dark' ? '#F7F7F7' : '#363636',
            }}>
            LogOut
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Search for images"
        placeholderTextColor={theme === 'dark' ? 'lightgrey' : '#363636'}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          padding: 10,
          borderWidth: 1,
          marginBottom: 10,
          borderColor: 'green',
          marginHorizontal: 5,
          borderRadius: 8,
          backgroundColor: theme === 'dark' ? '#1A1623' : '#F2F2F2',
          color: theme === 'dark' ? '#F7F7F7' : '#363636',
        }}
      />

      {/* Search Button */}
      <TouchableOpacity
        onPress={handleSearch}
        style={{
          padding: 10,
          backgroundColor: '#0f6b4e',
          borderRadius: 8,
          marginHorizontal: 5,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: theme === 'dark' ? '#F7F7F7' : '#363636',
            fontSize: 18,
          }}>
          Search
        </Text>
      </TouchableOpacity>

      {/* Loading indicator for search */}
      {searchLoading && (
        <ActivityIndicator size="small" color="#0000ff" style={{margin: 10}} />
      )}

      {/* Display Search History */}
      {searchHistory.length > 0 && (
        <View style={{padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 5,
                color: theme === 'dark' ? '#F7F7F7' : '#363636',
              }}>
              Recent Searches
            </Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text>Clear Search</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              maxHeight: 100,
              padding: 5,
            }}>
            {searchHistory.map((historyItem, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSearchQuery(historyItem);
                  handleSearch();
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    padding: 5,
                    color: theme === 'dark' ? '#F7F7F7' : '#363636',
                  }}>
                  {historyItem}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Loading state for initial page */}
      {loading && page === 1 && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            marginTop: 250,
          }}
        />
      )}

      {/* Error Handling */}
      {error && (
        <Text
          style={{
            fontSize: 14,
            padding: 8,
            color: theme === 'dark' ? '#F7F7F7' : '#363636',
          }}>
          {error}
        </Text>
      )}

      {/* Images List */}
      <View
        style={{
          height: Dimensions.get('window').height - 190,
        }}>
        <FlatList
          data={images}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View
              style={{
                marginVertical: 10,
                borderWidth: 1,
                borderColor: 'green',
                marginHorizontal: 8,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  padding: 8,
                  color: theme === 'dark' ? '#F7F7F7' : '#363636',
                }}>
                {item.alt_description || 'No Description'}
              </Text>
              <Image
                source={{uri: item.urls.small}}
                style={{
                  width: '100%',
                  height: 200,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
                resizeMode="cover"
              />
            </View>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading &&
            page > 1 && <ActivityIndicator size="large" color="#0000ff" />
          }
          ListEmptyComponent={
            !loading && (
              <Text
                style={{
                  fontSize: 14,
                  padding: 8,
                  color: theme === 'dark' ? '#F7F7F7' : '#363636',
                }}>
                No images found
              </Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
