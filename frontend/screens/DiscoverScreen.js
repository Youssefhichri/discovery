import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const DiscoverScreen = () => {
  const { explorer, business } = useAuth();
  console.log('Business user:', business);

  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://192.168.58.72:3000/posts/allposts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const posts = await response.json();
      const categorizedPosts = categorizePosts(posts);
      setCategories(categorizedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const categorizePosts = (posts) => {
    const categories = {};

    posts.forEach((post) => {
      if (!categories[post.category]) {
        categories[post.category] = [];
      }
      categories[post.category].push({
        id: post.idposts,
        name: post.title,
        location: post.location,
        image: { uri: post.image1 },
        description: post.description,
        image2: post.image2 ? { uri: post.image2 } : null,
        image3: post.image3 ? { uri: post.image3 } : null,
        image4: post.image4 ? { uri: post.image4 } : null,
        averageRating: post.averageRating,
      });
    });

    return Object.keys(categories).map((key, index) => ({
      id: index + 1,
      name: key,
      posts: categories[key],
    }));
  };

  const handleRating = useCallback(async (postId, rating) => {
    try {
      const response = await fetch(`http://192.168.58.72:3000/ratings/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idposts: postId, 
          explorer_idexplorer: explorer.idexplorer, 
          rating 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rating');
      }
      
      const data = await response.json();
      
      // now update the state with the new average rating
      setCategories(prevCategories => 
        prevCategories.map(category => ({
          ...category,
          posts: category.posts.map(post => 
            post.id === postId ? { ...post, averageRating: parseFloat(data.averageRating) } : post
          )
        }))
      );
  
      // show success message for explorer to know they rated
      Alert.alert('Success', 'Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', error.message || 'Failed to submit rating');
    }
  }, [explorer.idexplorer]);

  const navigateToPost = useCallback((postId, postDetails) => {
    navigation.navigate('Onepost', { postId, postDetails });
  }, [navigation]);

  const renderPostItem = useMemo(() => ({ item }) => {
    const postId = item.id.toString();
  
    if (business && Object.keys(business).length > 0) {
      // render for business view
      return (
        <TouchableOpacity onPress={() => navigateToPost(postId, item)} style={styles.postContainer}>
          <Image source={item.image} style={styles.postImage} />
          <Text style={styles.postName}>{item.name}</Text>
          <View style={styles.locationContainer}>
            <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
            <Text style={styles.postLocation}>{item.location}</Text>
          </View>
          <Text style={styles.businessText}>Business view, no ratings</Text>
        </TouchableOpacity>
      );
    } else if (explorer && Object.keys(explorer).length > 0) {
      // render for explorer view
      return (
        <TouchableOpacity onPress={() => navigateToPost(postId, item)} style={styles.postContainer}>
          <Image source={item.image} style={styles.postImage} />
          <Text style={styles.postName}>{item.name}</Text>
          <View style={styles.locationContainer}>
            <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
            <Text style={styles.postLocation}>{item.location}</Text>
          </View>
          <Rating 
            postId={postId} 
            onRate={(rating) => handleRating(postId, rating)}
          />
        </TouchableOpacity>
      );
    } else {
      // handle the case when neither business nor explorer is logged in or if they are empty objects
      return (
        <TouchableOpacity onPress={() => navigateToPost(postId, item)} style={styles.postContainer}>
          <Image source={item.image} style={styles.postImage} />
          <Text style={styles.postName}>{item.name}</Text>
          <View style={styles.locationContainer}>
            <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
            <Text style={styles.postLocation}>{item.location}</Text>
          </View>
          <Text style={styles.signupText}>Sign up to rate this!</Text>
        </TouchableOpacity>
      );
    }
  }, [navigateToPost, handleRating, business, explorer]);
  

  const renderCategory = useCallback(({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <FlatList
        data={item.posts}
        renderItem={renderPostItem}
        keyExtractor={(post) => post.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  ), [renderPostItem]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left-arrow.jpg')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Discover</Text>
        <TouchableOpacity onPress={() => {/* Add notification functionality later */}}>
          <Image source={require('../assets/notification.jpg')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subheaderText}>All Explored Places</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(category) => category.id.toString()}
        contentContainerStyle={styles.categoriesContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 50,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
  },
  subheaderText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 13,
    marginTop: 20,
  },
  categoriesContainer: {
    flexGrow: 1,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postContainer: {
    width: (width - 60) / 2, 
    marginRight: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginLeft: -20,
    alignItems: 'center',
    marginBottom: 20, 
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  postName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  postLocation: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContainer: {
    paddingLeft: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  businessText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default React.memo(DiscoverScreen);
