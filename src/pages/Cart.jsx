
import { useEffect, useState, } from "react";
import axios from "axios";
import { useForm } from 'react-hook-form';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;




export default function Cart() {
    const [cart, setCart] = useState({});

    const [isSreenLoading, setIsSreenLoading] = useState(false);

    const getCart = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
          setCart(res.data.data) //前面是axios的data，後面是回傳出來的data
        } catch (error) {
          alert("取得產品失敗");
        }
      }
    
      useEffect(() => {
        getCart();
      }, []);

      const removeCart = async () => {
        setIsSreenLoading(true);
        try {
          await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`)
          getCart();
        } catch (error) {
          alert("刪除購物車失敗")
        } finally {
          setIsSreenLoading(false);
        }
      }
    
      const removeCartItem = async (cartItem_id) => {
        try {
          await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`)
          getCart();
        } catch (error) {
          alert("刪除購物車單一產品失敗")
        }
      }
    
      const updatedCartItem = async (cartItem_id, product_id, qty) => {
        setIsSreenLoading(true);
        try {
          await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
            data: {
              product_id,
              qty: Number(qty)
            }
          })
          getCart();
        } catch (error) {
          alert("更新購物車產品失敗")
        } finally {
          setIsSreenLoading(false);
        }
      }

      const {
        register,
        handleSubmit,
        formState: { errors },
        reset
      } = useForm()
    
      const formSubmiit = handleSubmit((data) => {
        const { message, ...user } = data;
        const userInfo = {
          data: {
            message,
            user
          }
        };
        checkout(userInfo);
      })
    
      const checkout = async (data) => {
        setIsSreenLoading(true);
        try {
          await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data)
          reset();
          getCart();
        } catch (error) {
          alert("結帳失敗")
        } finally {
          setIsSreenLoading(false);
        }
      }


    return (
        <div className="container">
            <div>
                {cart.carts?.length > 0 && (
                    <div>
                        <div className="text-end py-3">
                            <button onClick={removeCart} className="btn btn-outline-danger" type="button">
                                清空購物車
                            </button>
                        </div>

                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>品名</th>
                                    <th style={{ width: "150px" }}>數量/單位</th>
                                    <th className="text-end">單價</th>
                                    <th className="text-end"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {cart.carts?.map((cartItem) => (
                                    <tr key={cartItem.id}>
                                        <td>{cartItem.product.title}</td>
                                        <td style={{ width: "150px" }}>
                                            <div className="d-flex align-items-center">
                                                <div className="btn-group me-2" role="group">
                                                    <button
                                                        type="button"
                                                        onClick={() => updatedCartItem(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                                                        className="btn btn-outline-dark btn-sm"
                                                        disabled={cartItem.qty === 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span
                                                        className="btn border border-dark"
                                                        style={{ width: "50px", cursor: "auto" }}
                                                    >{cartItem.qty}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updatedCartItem(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                                                        className="btn btn-outline-dark btn-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="input-group-text bg-transparent border-0">
                                                    {cartItem.product.unit}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-end">{cartItem.total}</td>
                                        <td>
                                            <button onClick={() => removeCartItem(cartItem.id)} type="button" className="btn btn-outline-danger btn-sm text-end">
                                                刪除
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr >
                                    <td colSpan="3" className="text-end" >
                                        總計：
                                    </td>
                                    <td style={{ width: "130px" }}>{cart.total}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
            <div className="my-5 row justify-content-center">
                <form onSubmit={formSubmiit} className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            {...register('email', {
                                required: "Email必填",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Email格式錯誤"
                                }
                            })}
                            id="email"
                            type="email"
                            className={`form-control ${errors.email && 'is-invalid'}`}
                            placeholder="請輸入 Email"
                        />
                        {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            收件人姓名
                        </label>
                        <input
                            {...register('name', {
                                required: "姓名必填"
                            })}
                            id="name"
                            className={`form-control ${errors.name && 'is-invalid'}`}
                            placeholder="請輸入姓名"
                        />

                        {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tel" className="form-label">
                            收件人電話
                        </label>
                        <input
                            {...register('tel', {
                                required: "電話必填",
                                pattern: {
                                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                                    message: "電話格式錯誤"
                                }
                            })}
                            id="tel"
                            type="text"
                            className={`form-control ${errors.tel && 'is-invalid'}`}
                            placeholder="請輸入電話"
                        />

                        {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                            收件人地址
                        </label>
                        <input
                            {...register('address', {
                                required: "地址必填"
                            })}
                            id="address"
                            type="text"
                            className={`form-control ${errors.address && 'is-invalid'}`}
                            placeholder="請輸入地址"
                        />

                        {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">
                            留言
                        </label>
                        <textarea
                            {...register('message')}
                            id="message"
                            className="form-control"
                            cols="30"
                            rows="10"
                        ></textarea>
                    </div>
                    <div className="text-end">
                        <button type="submit" className="btn btn-danger">
                            送出訂單
                        </button>
                    </div>
                </form>
            </div>

            {isSreenLoading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        zIndex: 999,
                    }}
                >
                    <div className="spinner-border " role="status">
                        <span className="visually-hidden ">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    )
}