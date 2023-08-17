import request from "./request";

const ENDPOINT = "api/user";

// const getAllCategories = async(params) => {
//   const url = `${ENDPOINT}/all`;
//   return request.get(url,{params}).then((res) => {return res;})
// }
const getAllUser = async (params) => {
    const url = `${ENDPOINT}`;
    return request.get(url , {params}).then((res) => {
        return res;
      });
}
const deleteUser = async (id) => {
    const url = `${ENDPOINT}?id=${id}`;
    return request.delete(url).then((res) => {
      return res;
    });
  };

  const getUserById = async (id) => {
    const url = `${ENDPOINT}/byId?id=${id}`;
    return request.get(url).then((res) => {
      return res;
    });
  };

  const update = async (data) => {
    const url = `${ENDPOINT}`;
    return request.put(url, data).then((res) => {
      return res;
    })
  }

  const getAllRoles = async () => {
    const url = `${ENDPOINT}/roles`;
    return request.get(url).then((res) => {return res})
  }

const userService = {getAllUser , deleteUser ,getUserById , getAllRoles , update};

export default userService;