import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import "./card2.css";

const API = "https://to-dos-api.softclub.tj/api/to-dos";
const api = "https://to-dos-api.softclub.tj/images/";

const schema = z.object({
    name: z.string().min(3, "Name бояд камаш 3 ҳарф бошад"),
    description: z.string().min(5, "Description бояд камаш 5 ҳарф бошад"),
});

function DIV2() {
    const [user, setUser] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<FileList | null>(null);

    const [errors, setErrors] = useState({
        name: "",
        description: "",
    });

    const [openAdd, setOpenAdd] = useState(false);

    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImages, setEditImages] = useState<FileList | null>(null);

    const [editErrors, setEditErrors] = useState({
        name: "",
        description: "",
    });

    const [open, setOpen] = useState(false);

    async function getData() {
        try {
            const response = await axios.get(API);
            setUser(response.data.data ?? []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    async function addUser(e: React.FormEvent) {
        e.preventDefault();

        const result = schema.safeParse({
            name,
            description,
        });

        if (!result.success) {
            setErrors({
                name: result.error.issues.find((item) => item.path[0] === "name")?.message || "",
                description: result.error.issues.find((item) => item.path[0] === "description")?.message || "",
            });
            return;
        }

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Description", description);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append("Images", images[i]);
            }
        }

        try {
            await axios.post(API, formData);
            await getData();

            setName("");
            setDescription("");
            setImages(null);
            setErrors({
                name: "",
                description: "",
            });
            setOpenAdd(false);
        } catch (error) {
            console.log(error);
        }
    }

    function openEdit(elem: User) {
        setEditId(elem.id);
        setEditName(elem.name);
        setEditDescription(elem.description);
        setEditImages(null);
        setEditErrors({
            name: "",
            description: "",
        });
        setOpen(true);
    }

    async function saveEdit(e: React.FormEvent) {
        e.preventDefault();

        const result = schema.safeParse({
            name: editName,
            description: editDescription,
        });

        if (!result.success) {
            setEditErrors({
                name: result.error.issues.find((item) => item.path[0] === "name")?.message || "",
                description: result.error.issues.find((item) => item.path[0] === "description")?.message || "",
            });
            return;
        }

        try {
            if (editImages && editImages.length > 0) {
                const formData = new FormData();
                formData.append("Id", String(editId));
                formData.append("Name", editName);
                formData.append("Description", editDescription);
                for (let i = 0; i < editImages.length; i++) {
                    formData.append("Images", editImages[i]);
                }
                await axios.put(`${API}?id=${editId}`, formData);
            } else {
                await axios.put(`${API}?id=${editId}`, {
                    id: editId,
                    name: editName,
                    description: editDescription,
                });
            }

            setOpen(false);
            setEditImages(null);
            await getData();
        } catch (error) {
            console.log(error);
        }
    }

    async function delUser(id: number) {
        try {
            await axios.delete(`${API}?id=${id}`);
            await getData();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className="addHeader">
                <h2>Users</h2>

                <button
                    className="addBtn"
                    type="button"
                    onClick={() => {
                        setName("");
                        setDescription("");
                        setImages(null);
                        setErrors({
                            name: "",
                            description: "",
                        });
                        setOpenAdd(true);
                    }}
                >
                    + Add User
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {user.map((elem) => (
                        <tr key={elem.id}>
                            <td>
                                {elem.images?.[0]?.imageName ? (
                                    <img
                                        src={`${api}${elem.images[0].imageName}`}
                                        alt={elem.name}
                                        width="50"
                                    />
                                ) : null}
                            </td>

                            <td>{elem.name}</td>
                            <td>{elem.description}</td>

                            <td>
                                <button
                                    type="button"
                                    onClick={() => openEdit(elem)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => delUser(elem.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {openAdd && (
                <div
                    className="modal"
                    onClick={() => setOpenAdd(false)}
                >
                    <div
                        className="modalContent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Add User</h2>

                        <form onSubmit={addUser}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors({
                                        ...errors,
                                        name: "",
                                    });
                                }}
                            />

                            {errors.name && (
                                <p className="error">{errors.name}</p>
                            )}

                            <input
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrors({
                                        ...errors,
                                        description: "",
                                    });
                                }}
                            />

                            {errors.description && (
                                <p className="error">{errors.description}</p>
                            )}

                            <input
                                type="file"
                                multiple
                                onChange={(e) => setImages(e.target.files)}
                            />

                            <div className="modalButtons">
                                <button type="submit">Add</button>

                                <button
                                    type="button"
                                    onClick={() => setOpenAdd(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {open && (
                <div
                    className="modal"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="modalContent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Edit User</h2>

                        <form onSubmit={saveEdit}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={editName}
                                onChange={(e) => {
                                    setEditName(e.target.value);
                                    setEditErrors({
                                        ...editErrors,
                                        name: "",
                                    });
                                }}
                            />

                            {editErrors.name && (
                                <p className="error">{editErrors.name}</p>
                            )}

                            <input
                                type="text"
                                placeholder="Description"
                                value={editDescription}
                                onChange={(e) => {
                                    setEditDescription(e.target.value);
                                    setEditErrors({
                                        ...editErrors,
                                        description: "",
                                    });
                                }}
                            />

                            {editErrors.description && (
                                <p className="error">{editErrors.description}</p>
                            )}

                            <input
                                type="file"
                                multiple
                                onChange={(e) => setEditImages(e.target.files)}
                            />

                            <div className="modalButtons">
                                <button type="submit">Save</button>

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DIV2;