import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, SPACING} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PaymentFooter from '../components/PaymentFooter';
import CartItem from '../components/CartItem';
import RazorpayCheckout from 'react-native-razorpay';
import PopUpAnimation from '../components/PopUpAnimation';

const CartScreen = ({navigation, route}: any) => {
  const CartList = useStore((state: any) => state.CartList);
  const CartPrice = useStore((state: any) => state.CartPrice);
  const addToOrderHistoryListFromCart = useStore(
    (state: any) => state.addToOrderHistoryListFromCart,
  );
  const incrementCartItemQuantity = useStore(
    (state: any) => state.incrementCartItemQuantity,
  );
  const decrementCartItemQuantity = useStore(
    (state: any) => state.decrementCartItemQuantity,
  );
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const tabBarHeight = useBottomTabBarHeight();
  const [showAnimation, setShowAnimation] = useState(false);
  const [orderId, setOrderId] = useState<any>(null);

  const PaymentSucess = (id:any) => {
    setShowAnimation(true);
    addToOrderHistoryListFromCart();
    calculateCartPrice();
    setTimeout(() => {
      setShowAnimation(false);
      navigation.navigate('History');
    }, 3000);
  };

  const buttonPressHandler = () => {
    //navigation.push('Payment', {amount: CartPrice});
    const imgURL = 'https://img.icons8.com/?size=100&id=KT2mdG22VC28&format=png&color=000000';
      let options: any = {
        description: 'Credits towards consultation',
        image: imgURL, //require('../../images.png')
        currency: 'INR', //In USD - only card option will exist rest(like wallet, UPI, EMI etc) will hide
        key: 'rzp_test_wUETt6HZJQyiLw',
        amount: CartPrice * 100,
        name: 'Payment',
        order_id: '', //Replace this with an order_id(response.data.orderId) created using Orders API.
        prefill: {
          email: 'hasan@example.com',
          contact: '9191919191',
          name: 'Hasan',
        }, //if prefill is not provided then on razorpay screen it has to be manually entered.
        theme: { color: COLORS.primaryOrangeHex },
      };
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          //Alert.alert(`Success: ${data.razorpay_payment_id}`);
          //buttonPressHandler();
          setOrderId(data?.razorpay_payment_id);
          PaymentSucess(data.razorpay_payment_id);
        })
        .catch(error => {
          // handle failure
          Alert.alert(`Transation Failed !`);
        });
  };

  const incrementCartItemQuantityHandler = (id: string, size: string) => {
    incrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  const decrementCartItemQuantityHandler = (id: string, size: string) => {
    decrementCartItemQuantity(id, size);
    calculateCartPrice();
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showAnimation && (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/successful.json')}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, {marginBottom: tabBarHeight}]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Cart" />

            {CartList.length == 0 ? (
              <EmptyListAnimation title={'Cart is Empty'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {CartList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <CartItem
                      id={data.id}
                      name={data.name}
                      imagelink_square={data.imagelink_square}
                      special_ingredient={data.special_ingredient}
                      roasted={data.roasted}
                      prices={data.prices}
                      type={data.type}
                      incrementCartItemQuantityHandler={
                        incrementCartItemQuantityHandler
                      }
                      decrementCartItemQuantityHandler={
                        decrementCartItemQuantityHandler
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {CartList.length != 0 && (
            <PaymentFooter
              buttonPressHandler={buttonPressHandler}
              buttonTitle="Pay"
              price={{price: CartPrice, currency: '₹'}}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  LottieAnimation: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});

export default CartScreen;
