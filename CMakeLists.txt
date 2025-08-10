cmake_minimum_required(VERSION 3.20)
include(C:/Shaders/vcpkg/scripts/buildsystems/vcpkg.cmake)

project(GraphicsApp LANGUAGES CXX)

# --- C++ Options ---
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(DEFINED ENV{VCPKG_ROOT} AND EXISTS "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")
    set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
        CACHE STRING "Vcpkg toolchain file")
    message(STATUS "Using vcpkg toolchain from $ENV{VCPKG_ROOT}")
else()
    message(WARNING "VCPKG_ROOT is not defined or toolchain file missing")
endif()


# --- Presets-friendly output ---
if(NOT CMAKE_RUNTIME_OUTPUT_DIRECTORY)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
endif()

# --- Source files ---
file(GLOB_RECURSE SRC_FILES CONFIGURE_DEPENDS src/*.cpp src/*.h)

# --- Executable ---
add_executable(GraphicsApp ${SRC_FILES})

# --- Dependencies ---
find_package(glfw3 CONFIG REQUIRED)
find_package(assimp CONFIG REQUIRED)
find_package(glad CONFIG REQUIRED)

target_link_libraries(GraphicsApp PRIVATE glfw assimp::assimp glad::glad)

# --- Include shader directory as resource path ---
#target_compile_definitions(GraphicsApp PRIVATE SHADER_DIR="${CMAKE_SOURCE_DIR}/shaders")

target_include_directories(GraphicsApp
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# --- Shader auto-copy (next to built binary) ---
add_custom_target(copy_shaders ALL
  COMMAND ${CMAKE_COMMAND} -E copy_directory
          "${CMAKE_SOURCE_DIR}/src"
          "$<TARGET_FILE_DIR:GraphicsApp>/src"
)
add_dependencies(GraphicsApp copy_shaders)

# --- Optional modules ---
#add_subdirectory(external/imgui)
#target_link_libraries(GraphicsApp PRIVATE imgui)
