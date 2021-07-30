import { User, Transaction, Payment, USER_has_PAYMENT } from './schema';

async function initMockData(): Promise<void> {
  try {
    const user1 = await User.create({
      email: 'test@woowahan.com',
      password: '123456',
      refresh_token: 'aesljfniownigoajflksdjklcm12',
      is_OAuth: false,
    });
    const payment1 = await Payment.create({
      name: '현대카드',
    });
    const payment2 = await Payment.create({
      name: 'KB카드',
    });
    const payment3 = await Payment.create({
      name: '현금',
    });
    await Payment.create({
      name: 'BC카드',
    });
    await Payment.create({
      name: '삼성카드',
    });
    await Payment.create({
      name: '롯데카드',
    });
    await Payment.create({
      name: '신한카드',
    });
    await Payment.create({
      name: '우리카드',
    });
    await Transaction.create({
      date: new Date('2021.7.31'),
      category: 'food',
      title: '저녁',
      payment: '현대카드',
      price: 145000,
      USERId: user1.getDataValue('id'),
    });
    await Transaction.create({
      date: new Date('2021.7.31'),
      category: 'culture',
      title: '영화관',
      payment: '현대카드',
      price: 14000,
      USERId: user1.getDataValue('id'),
    });
    await Transaction.create({
      date: new Date('2021.7.31'),
      category: 'transport',
      title: '택시',
      payment: '현금',
      price: 7300,
      USERId: user1.getDataValue('id'),
    });
    await Transaction.create({
      date: new Date('2021.7.31'),
      category: 'health',
      title: '치과진료',
      payment: 'KB카드',
      price: 22300,
      USERId: user1.getDataValue('id'),
    });
    await Transaction.create({
      date: new Date('2021.7.28'),
      category: 'culture',
      title: '아쿠아리움',
      payment: '현대카드',
      price: 80000,
      USERId: user1.getDataValue('id'),
    });
    await USER_has_PAYMENT.create({
      USERId: user1.getDataValue('id'),
      PAYMENTId: payment1.getDataValue('id'),
    });
    await USER_has_PAYMENT.create({
      USERId: user1.getDataValue('id'),
      PAYMENTId: payment2.getDataValue('id'),
    });
    await USER_has_PAYMENT.create({
      USERId: user1.getDataValue('id'),
      PAYMENTId: payment3.getDataValue('id'),
    });
  } catch (err) {
    console.log(err);
  }
}

export default initMockData;
