/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Divider, List, Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

import { PlusCircleFilled } from '@ant-design/icons';
import { groupContactApi } from '../configs/api';

const Contact = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    fetchGroupData();
  }, []);

  const createGroupData = async (data) => {
    setLoading(true);
    const response = await fetch(groupContactApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + props.auth.token.atoken,
      },
      body: JSON.stringify(data),
    });
    const resjson = await response.json();
    if (resjson.statusCode) {
      // error handle
      return null;
    }
    setLoading(false);
    console.log(resjson);
    return resjson;
  };
  const fetchGroupData = async () => {
    setLoading(true);
    const response = await fetch(groupContactApi, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + props.auth.token.atoken,
      },
    });
    let resjson = await response.json();

    if (resjson.statusCode) {
      // error handle
      return;
    }
    setLoading(false);
    setData(resjson);
  };
  const handleVisibleModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const onFinishCreateGroup = async (values) => {
    try {
      const res = await createGroupData(values);
      if (res) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Create Group has success',
          showConfirmButton: false,
          timer: 900,
        }).then(() => {
          setData([...data, { id: res.id, name: res.name, count: 0 }]);
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Create Group has error!',
          text: 'Create Group invalid',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Create Group has error!',
        text: 'Create Group invalid',
      });
    }
    setModalVisible(false);
  };
  return (
    <div className="animated fadeIn">
      <Modal
        title="Create Contact Groups"
        onCancel={handleCloseModal}
        visible={modalVisible}
        footer={null}
      >
        <Form name="creatgroup_form" className="creatgroup-form" onFinish={onFinishCreateGroup}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your Contact Name!' }]}
          >
            <Input placeholder="Groups Name" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" block>
              Create Groups
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Divider orientation="left">Contact Groups</Divider>
      <List
        bordered
        loading={loading}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Link to={'/contact/group/' + item.id}>
              <h3>
                {item.name} <small style={{ color: '#e2e2e2' }}>({item.count})</small>
              </h3>
            </Link>
          </List.Item>
        )}
      />

      <Button
        loading={loading}
        onClick={handleVisibleModal}
        type="primary"
        icon={<PlusCircleFilled />}
        block
      >
        Create Group
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
